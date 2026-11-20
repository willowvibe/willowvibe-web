"use client";

import { useState, useRef, useEffect, type ReactNode } from "react";
import { MessageCircle, X, Send, ArrowRight } from "lucide-react";
import Link from "next/link";
import { BOOKING_URL } from "@/lib/site";

type Message = {
  from: "bot" | "user";
  text: string;
  link?: { label: string; href: string };
};

const WELCOME: Message = {
  from: "bot",
  text: "Hi! I can help you pick the right fixed-price engagement or answer questions about our open-source tools. What are you working on?",
};

const FALLBACK =
  "I am having trouble connecting right now. Please email us at contact@willowvibe.com or book a call at https://cal.com/harishng/30min";

const QUICK_REPLIES = [
  { label: "Which offer fits me?", text: "Which offer fits me?" },
  {
    label: "What does the pipeline audit include?",
    text: "What does the pipeline audit include?",
  },
  { label: "Prices and timelines", text: "Prices and timelines" },
  { label: "Book a call", text: "" },
] as const;

const ALLOWED_LINKS: { host: string; pathPrefix?: string }[] = [
  { host: "willowvibe.com" },
  { host: "www.willowvibe.com" },
  { host: "cal.com", pathPrefix: "/harishng" },
  { host: "github.com", pathPrefix: "/willowvibe" },
  { host: "willowvibe.github.io" },
  { host: "rag-docs-chatbot-three.vercel.app" },
  { host: "pypi.org", pathPrefix: "/project/pipelineprobe" },
  { host: "cosmicsaju.com" },
  { host: "dikshithra.com" },
];

const CONTACT_EMAIL = "contact@willowvibe.com";
const LINK_PATTERN =
  /(?:https?:\/\/[^\s<>"']+|(?:www\.)?(?:willowvibe\.com|cal\.com|github\.com|willowvibe\.github\.io|rag-docs-chatbot-three\.vercel\.app|pypi\.org|cosmicsaju\.com|dikshithra\.com)(?:\/[^\s<>"']*)?|[\w.+-]+@[\w.-]+\.\w+)/gi;

function splitTrailing(value: string): { candidate: string; trailing: string } {
  let end = value.length;

  while (end > 0 && /[.,;:!?)\]}*]/.test(value[end - 1])) {
    end -= 1;
  }

  return { candidate: value.slice(0, end), trailing: value.slice(end) };
}

function allowedHref(value: string): string | null {
  if (value.toLowerCase() === CONTACT_EMAIL) {
    return `mailto:${CONTACT_EMAIL}`;
  }

  const hasScheme = /^https?:\/\//i.test(value);
  if (!hasScheme && value.includes("@")) return null;

  const withScheme = hasScheme ? value : `https://${value}`;

  let url: URL;
  try {
    url = new URL(withScheme);
  } catch {
    return null;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") return null;

  const host = url.hostname.toLowerCase();
  const allowed = ALLOWED_LINKS.find(
    (entry) =>
      entry.host === host &&
      (!entry.pathPrefix || url.pathname.startsWith(entry.pathPrefix))
  );

  return allowed ? url.toString() : null;
}

function renderMessageText(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(LINK_PATTERN)) {
    const raw = match[0];
    const start = match.index ?? 0;

    if (start < lastIndex) continue;

    const { candidate, trailing } = splitTrailing(raw);
    const href = allowedHref(candidate);
    if (!href) continue;

    const bareDomain =
      !/^https?:\/\//i.test(candidate) && !candidate.includes("@");
    if (bareDomain && /[A-Za-z0-9._@/-]/.test(text[start - 1] ?? "")) {
      continue;
    }
    if (bareDomain && /[A-Za-z0-9_-]/.test(text[start + candidate.length] ?? "")) {
      continue;
    }

    nodes.push(text.slice(lastIndex, start));
    nodes.push(
      <a
        key={`link-${start}`}
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-cyan-400 underline underline-offset-2 hover:text-cyan-300"
      >
        {candidate}
      </a>
    );

    lastIndex = start + candidate.length;
    if (trailing) {
      nodes.push(trailing);
      lastIndex += trailing.length;
    }
  }

  nodes.push(text.slice(lastIndex));
  return nodes;
}

export function ChatBot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([WELCOME]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [unread, setUnread] = useState(0);
  const [started, setStarted] = useState(false);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [blockedUntil, setBlockedUntil] = useState<number | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const openRef = useRef(open);

  useEffect(() => {
    openRef.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      if (messages.length <= 1) {
        listRef.current?.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        bottomRef.current?.scrollIntoView({ behavior: "smooth" });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [open, messages]);

  useEffect(() => {
    if (!open) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [open]);

  useEffect(() => {
    if (blockedUntil === null) return;

    const delay = Math.max(0, blockedUntil - Date.now());
    const timer = setTimeout(() => setBlockedUntil(null), delay);
    return () => clearTimeout(timer);
  }, [blockedUntil]);

  const send = async (override?: string) => {
    const text = (override ?? input).trim();
    if (!text || loading || blockedUntil !== null) return;

    const userMsg: Message = { from: "user", text };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setStarted(true);
    setLoading(true);

    try {
      const conversationHistory = messages
        .filter((m) => m !== WELCOME)
        .map((m) => ({
          role: m.from === "user" ? "user" : "assistant",
          content: m.text,
        }));

      const outgoingMessages = [
        ...conversationHistory,
        { role: "user", content: text },
      ].slice(-10);

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: outgoingMessages }),
      });

      const remainingHeader = response.headers.get("X-RateLimit-Remaining");
      if (remainingHeader !== null) {
        const parsed = Number.parseInt(remainingHeader, 10);
        if (Number.isFinite(parsed) && parsed >= 0) setRemaining(parsed);
      }

      const data = await response.json().catch(() => null);

      if (response.status === 429) {
        const resetHeader = response.headers.get("X-RateLimit-Reset");
        if (resetHeader !== null) {
          const resetSeconds = Number.parseInt(resetHeader, 10);
          if (Number.isFinite(resetSeconds) && resetSeconds > 0) {
            setBlockedUntil(resetSeconds * 1000);
          }
        }

        const errorText =
          typeof data?.error === "string" ? data.error : FALLBACK;
        setMessages((prev) => [...prev, { from: "bot", text: errorText }]);
        if (!openRef.current) setUnread((n) => n + 1);
        return;
      }

      const reply =
        response.ok && typeof data?.reply === "string" ? data.reply : FALLBACK;

      const botMsg: Message = { from: "bot", text: reply };
      setMessages((prev) => [...prev, botMsg]);
      if (!openRef.current) setUnread((n) => n + 1);
    } catch {
      setMessages((prev) => [
        ...prev,
        { from: "bot", text: FALLBACK },
      ]);
      if (!openRef.current) setUnread((n) => n + 1);
    } finally {
      setLoading(false);
    }
  };

  const bookCall = () => {
    setStarted(true);
    window.open(BOOKING_URL, "_blank", "noopener,noreferrer");
    setMessages((prev) => [
      ...prev,
      {
        from: "bot",
        text: `You can book a 30-minute call here: ${BOOKING_URL}`,
      },
    ]);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      send();
    }
  };

  const quotaBlocked = blockedUntil !== null;

  return (
    <>
      {open && (
        <div className="fixed bottom-20 right-4 md:right-6 z-50 w-[calc(100vw-2rem)] max-w-sm">
          <div
            className="bg-neutral-900 border border-white/10 rounded-2xl shadow-2xl flex flex-col overflow-hidden"
            style={{ height: "420px" }}
          >
            <div className="flex items-center justify-between px-4 py-3 bg-neutral-800 border-b border-white/10">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                <span className="text-sm font-semibold text-white">WillowVibe AI</span>
              </div>
              <button
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="text-gray-500 hover:text-white transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div
              ref={listRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              aria-live="polite"
              role="log"
            >
              {messages.map((msg, i) => (
                <div
                  key={i}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 text-sm leading-relaxed ${
                      msg.from === "user"
                        ? "bg-cyan-400 text-black font-medium"
                        : "bg-neutral-800 text-gray-200 border border-white/5"
                    }`}
                  >
                    <p>{renderMessageText(msg.text)}</p>
                    {msg.link && (
                      <Link
                        href={msg.link.href}
                        onClick={() => setOpen(false)}
                        className="inline-flex items-center gap-1 mt-1.5 text-cyan-400 text-xs font-mono hover:underline"
                      >
                        {msg.link.label} <ArrowRight className="w-3 h-3" />
                      </Link>
                    )}
                  </div>
                </div>
              ))}

              {!started && (
                <div className="flex flex-wrap gap-2 pt-1">
                  {QUICK_REPLIES.map((chip) => (
                    <button
                      key={chip.label}
                      type="button"
                      onClick={() =>
                        chip.label === "Book a call"
                          ? bookCall()
                          : send(chip.text)
                      }
                      aria-label={chip.label}
                      className="min-h-8 px-2.5 py-1 rounded-full border border-white/10 bg-neutral-800 text-xs text-gray-300 hover:text-white hover:border-cyan-400/50 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400/60"
                    >
                      {chip.label}
                    </button>
                  ))}
                </div>
              )}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-neutral-800 border border-white/5 rounded-xl px-4 py-3">
                    <div className="flex gap-1.5 items-center">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            <div className="px-3 py-3 border-t border-white/10">
              <div className="flex gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Ask anything about WillowVibe..."
                  aria-label="Type your message"
                  disabled={loading}
                  maxLength={1000}
                  className="flex-1 bg-neutral-800 border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder:text-gray-600 outline-none focus:border-cyan-400/50 transition-colors disabled:opacity-50"
                />
                <button
                  onClick={() => send()}
                  disabled={loading || quotaBlocked}
                  aria-label="Send message"
                  className="w-9 h-9 rounded-lg bg-cyan-400 text-black flex items-center justify-center hover:bg-cyan-300 transition-colors flex-shrink-0 disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {(input.length > 800 || (remaining !== null && remaining <= 5)) && (
                <div className="flex items-center justify-between gap-2 mt-1 text-[10px] text-gray-500">
                  <span>
                    {input.length > 800 ? `${input.length}/1000` : ""}
                  </span>
                  <span>
                    {remaining !== null && remaining <= 5
                      ? `${remaining} questions left this hour`
                      : ""}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        onClick={() => { setUnread(0); setOpen((p) => !p); }}
        className="fixed bottom-5 right-4 md:right-6 z-50 w-[52px] h-[52px] rounded-full bg-cyan-400 text-black shadow-[0_0_20px_rgba(34,211,238,0.4)] flex items-center justify-center hover:scale-110 transition-all"
        aria-label="Open chat"
      >
        {open ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
        {!open && unread > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread}
          </span>
        )}
      </button>
    </>
  );
}
