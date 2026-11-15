import { NextResponse } from "next/server";

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

type ChatMessage = { role: "user" | "assistant"; content: string };

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

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY is not set");
    return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 500 });
  }

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
      body: JSON.stringify({
        model: "claude-haiku-5-5",
        max_tokens: 300,
        system: SYSTEM_PROMPT,
        messages,
      }),
    });

    if (!response.ok) {
      const data = await response.json().catch(() => null);
      console.error("Claude API error:", JSON.stringify(data));
      return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 500 });
    }

    const data = await response.json();
    const reply = data?.content?.[0]?.text;

    if (typeof reply !== "string" || reply.trim().length === 0) {
      return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 500 });
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat route error:", error);
    return NextResponse.json({ error: FRIENDLY_ERROR }, { status: 500 });
  }
}
