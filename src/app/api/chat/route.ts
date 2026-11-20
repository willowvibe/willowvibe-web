import { NextResponse } from "next/server";

// Chat providers: OpenRouter fallback chain plus Ollama Cloud.
const SYSTEM_PROMPT = `You are the WillowVibe Data Synapse AI assistant. You are helpful, professional, and concise. You represent WillowVibe on their website.

About WillowVibe:
- WillowVibe Data Synapse is a family-founded data engineering company
- Founded by Harish Nagari Gurumoorthy (Founder, Full Stack and Data Engineer, Python specialist)
- Co-founded by Sruthi Nagari Gurumoorthy (Co-Founder, Engineering, Marketing and Operations)
- PLM Advisor: Pawan Kumar (Systems Integration and PLM specialist)

Services offered:
1. Enterprise PLM and CAD — PLM platform architecture, BOM management, change control, CAD development
2. Data Engineering and Integration — Data pipeline development, cloud engineering, data migration
3. Data Trust and Analytics — Data quality, governance, observability, AI infrastructure, business intelligence

Products:
1. ObservaKit — Free open-source data observability tool self-hosted for small teams
2. PipelineProbe — Free open-source pipeline audit tool, one command generates a health report with a 0 to 100 score
3. Doctor App — Client project patient management app for independent doctors doing home and clinic visits (in development)
4. Cosmic Saju — Client project live web app at cosmicsaju.com offering Korean Four Pillars readings with human-reviewed reports
5. Dikshithra Atelier — Client project live e-commerce store at dikshithra.com for kurtis, kurti sets, salwars and office wear
6. rag-docs-chatbot — Free open-source document Q&A chatbot that answers from documents with page-level citations; live demo at rag-docs-chatbot-three.vercel.app
7. plm-bom-pipeline — Free open-source PLM analytics pipeline: synthetic BOMs and change control modelled into tested dbt marts

Tech stack: AWS, Snowflake, Databricks, Kafka, dbt, Airflow, Teamcenter, 3DEXPERIENCE, CATIA V5, SolidWorks, PostgreSQL, BigQuery, Redshift, Azure, GCP

Contact: contact@willowvibe.com
Website: www.willowvibe.com
LinkedIn: /company/willowvibe
GitHub: github.com/willowvibe

Response rules:
- Keep answers short and helpful 2 to 4 sentences maximum
- If someone asks about pricing say it is project-based and suggest contacting the team
- If someone asks to book or schedule direct them to the contact page
- Never make up information not in this prompt
- Always be warm and professional
- If a question is unrelated to WillowVibe politely redirect`;

const MAX_MESSAGES = 20;
const MAX_CONTENT_LENGTH = 2000;
const FRIENDLY_ERROR =
  "I am having trouble connecting right now. Please email us at contact@willowvibe.com";
const RATE_LIMIT_ERROR =
  "You've reached the chat limit for now. Please try again later or email contact@willowvibe.com";
const REQUEST_TIMEOUT_MS = 15_000;
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000;

type ChatMessage = { role: "user" | "assistant"; content: string };
type Provider = "openrouter" | "ollama";
type ModelConfig = { provider: Provider; model: string };

const DEFAULT_MODELS: ModelConfig[] = [
  { provider: "openrouter", model: "inclusionai/ling-3.2-flash:free" },
  { provider: "openrouter", model: "nvidia/nemotron-3.5-super-vl:free" },
  { provider: "ollama", model: "glm-5.3-flash" },
];

// Best-effort, in-memory rate limiting. Each serverless instance keeps its own
// Map, so the limit is not shared across instances and resets on cold starts.
const rateLimitStore = new Map<string, number[]>();

function validateMessages(input: unknown): ChatMessage[] | null {
  if (!Array.isArray(input) || input.length === 0 || input.length > MAX_MESSAGES) {
    return null;
  }

  const parsed: ChatMessage[] = [];

  for (const raw of input) {
    if (!raw || typeof raw !== "object") return null;

    const { role, content } = raw as Record<string, unknown>;

    if (role !== "user" && role !== "assistant") return null;
    if (typeof content !== "string") return null;

    const trimmed = content.trim();
    if (trimmed.length === 0 || trimmed.length > MAX_CONTENT_LENGTH) return null;

    parsed.push({ role, content: trimmed });
  }

  const firstUserIndex = parsed.findIndex((message) => message.role === "user");
  if (firstUserIndex === -1) return null;

  return parsed.slice(firstUserIndex);
}

function getModelChain(): ModelConfig[] {
  const raw = process.env.CHAT_MODELS?.trim();
  if (!raw) return DEFAULT_MODELS;

  const parsed: ModelConfig[] = [];

  for (const entry of raw.split(",")) {
    const trimmed = entry.trim();
    const separator = trimmed.indexOf(":");
    if (separator <= 0) continue;

    const provider = trimmed.slice(0, separator).trim().toLowerCase();
    const model = trimmed.slice(separator + 1).trim();

    if (!model) continue;
    if (provider !== "openrouter" && provider !== "ollama") continue;

    parsed.push({ provider, model });
  }

  return parsed.length > 0 ? parsed : DEFAULT_MODELS;
}

function getApiKey(provider: Provider): string | undefined {
  return provider === "openrouter"
    ? process.env.OPENROUTER_API_KEY
    : process.env.OLLAMA_API_KEY;
}

function hashIp(value: string): string {
  let hash = 5381;
  for (let i = 0; i < value.length; i += 1) {
    hash = ((hash << 5) + hash + value.charCodeAt(i)) | 0;
  }
  return (hash >>> 0).toString(36);
}

function getClientKey(request: Request): string {
  const forwardedFor = request.headers.get("x-forwarded-for");
  const ip = forwardedFor?.split(",")[0]?.trim() || "unknown";
  return hashIp(ip);
}

function getRateLimit(): number {
  const parsed = Number.parseInt(process.env.CHAT_RATE_LIMIT_PER_HOUR ?? "", 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 20;
}

function isRateLimited(clientKey: string): boolean {
  const now = Date.now();
  const cutoff = now - RATE_LIMIT_WINDOW_MS;

  for (const [key, timestamps] of rateLimitStore) {
    const recent = timestamps.filter((timestamp) => timestamp > cutoff);
    if (recent.length === 0) {
      rateLimitStore.delete(key);
    } else {
      rateLimitStore.set(key, recent);
    }
  }

  const timestamps = rateLimitStore.get(clientKey) ?? [];
  if (timestamps.length >= getRateLimit()) {
    return true;
  }

  timestamps.push(now);
  rateLimitStore.set(clientKey, timestamps);
  return false;
}

function stripThinkBlock(text: string): string {
  return text.replace(/<think[\s\S]*?<\/think>/gi, "").trim();
}

async function callProvider(
  config: ModelConfig,
  messages: ChatMessage[],
  apiKey: string
): Promise<string | null> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  const fullMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...messages,
  ];

  try {
    let response: Response;
    let text: unknown;

    if (config.provider === "openrouter") {
      response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "https://www.willowvibe.com",
          "X-Title": "WillowVibe",
        },
        body: JSON.stringify({
          model: config.model,
          messages: fullMessages,
          max_tokens: 300,
          reasoning: { enabled: false },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error(
          `Chat provider failed: provider=${config.provider} model=${config.model} status=${response.status}`
        );
        return null;
      }

      const data = await response.json().catch(() => null);
      text = data?.choices?.[0]?.message?.content;
    } else {
      response = await fetch("https://ollama.com/api/chat", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: config.model,
          messages: fullMessages,
          stream: false,
          think: false,
          options: { num_predict: 300 },
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        console.error(
          `Chat provider failed: provider=${config.provider} model=${config.model} status=${response.status}`
        );
        return null;
      }

      const data = await response.json().catch(() => null);
      text = data?.message?.content;
    }

    if (typeof text !== "string") {
      console.error(
        `Chat provider failed: provider=${config.provider} model=${config.model} status=${response.status} reason=empty`
      );
      return null;
    }

    const reply = stripThinkBlock(text);
    if (reply.length === 0) {
      console.error(
        `Chat provider failed: provider=${config.provider} model=${config.model} status=${response.status} reason=empty`
      );
      return null;
    }

    return reply;
  } catch (error) {
    const status = error instanceof Error && error.name === "AbortError" ? "timeout" : "network_error";
    console.error(
      `Chat provider failed: provider=${config.provider} model=${config.model} status=${status}`
    );
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const messages = validateMessages((body as { messages?: unknown } | null)?.messages);

  if (!messages) {
    return NextResponse.json(
      { error: "Invalid messages. Send 1 to 20 user/assistant messages with non-empty content." },
      { status: 400 }
    );
  }

  if (isRateLimited(getClientKey(request))) {
    return NextResponse.json({ error: RATE_LIMIT_ERROR }, { status: 429 });
  }

  if (!process.env.OPENROUTER_API_KEY && !process.env.OLLAMA_API_KEY) {
    console.error("No chat provider API key configured (OPENROUTER_API_KEY or OLLAMA_API_KEY)");
    return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 500 });
  }

  for (const config of getModelChain()) {
    const apiKey = getApiKey(config.provider);
    if (!apiKey) continue;

    const reply = await callProvider(config, messages, apiKey);
    if (reply) {
      console.info(`Chat answered: provider=${config.provider} model=${config.model}`);
      return NextResponse.json({ reply });
    }
  }

  console.error("All chat providers failed");
  return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 500 });
}
