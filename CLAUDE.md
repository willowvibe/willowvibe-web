# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

WillowVibe | Data Synapse company website. A Next.js 16 App Router marketing site deployed to Vercel at `www.willowvibe.com`.

## Common Commands

- `npm run dev` — Start the development server on http://localhost:3000
- `npm run build` — Production build
- `npm run start` — Start production server (requires build first)
- `npm run lint` — Run ESLint (Next.js core-web-vitals + typescript configs)

No test framework is configured.

## Environment Variables

Copy `.env.example` to `.env.local` for local development. Required variables:

```
HOSTINGER_USER=your-email@willowvibe.com
HOSTINGER_PASSWORD=your-hostinger-password
OPENROUTER_API_KEY=your-openrouter-api-key
```

Optional variables:

```
OLLAMA_API_KEY=your-ollama-cloud-api-key
CHAT_MODELS=openrouter:inclusionai/ling-3.2-flash:free,ollama:glm-5.3-flash
CHAT_RATE_LIMIT_PER_HOUR=20
```

- `HOSTINGER_USER` / `HOSTINGER_PASSWORD` — required by the contact API (`src/app/api/contact/route.ts`); the transporter is created lazily and the route returns 500 with a server-side log when they are missing.
- `OPENROUTER_API_KEY` — required by the chat API (`src/app/api/chat/route.ts`); it calls OpenRouter free models, with Ollama Cloud as an optional fallback. The route returns 500 only when neither `OPENROUTER_API_KEY` nor `OLLAMA_API_KEY` is set.
- `OLLAMA_API_KEY` — optional; enables the Ollama Cloud fallback provider.
- `CHAT_MODELS` — optional comma-separated `<provider>:<model>` chain (providers: `openrouter`, `ollama`) overriding the default model chain. Entries with an unknown provider or missing model are ignored.
- `CHAT_RATE_LIMIT_PER_HOUR` — optional per-IP requests per rolling hour; defaults to `20`.

Providers without an API key are skipped, so the chain falls through to the next configured provider. These must also be configured in the Vercel dashboard under Project Settings → Environment Variables.

> **Note:** The contact API uses Hostinger SMTP (`smtp.hostinger.com:465`), not Gmail. Older documentation may reference Gmail env vars — those are obsolete.

## Architecture

### Next.js App Router
- `src/app/page.tsx` — Home page
- `src/app/about/page.tsx` — About / team page (plus `about/layout.tsx` for page metadata)
- `src/app/services/page.tsx` — Services hub: five cards from `src/lib/services.ts` (plus `services/layout.tsx`)
- `src/app/services/[slug]/page.tsx` — One statically generated page per service (`ai-on-your-data`, `ai-integration`, `data-pipelines`, `plm-data-migration`, `web-and-data-apps`) rendered by `src/components/ServicePage.tsx` with Service, BreadcrumbList and FAQPage JSON-LD; unknown slugs 404
- `src/app/products/page.tsx` — Products page (plus `products/layout.tsx`)
- `src/app/contact/page.tsx` — Contact page with form (plus `contact/layout.tsx`); prefills the message from `?offer=<slug>`
- `src/app/work-with-us/page.tsx` — Fixed-price offers (AI pilot, pipeline audit, data stack kickoff, PLM readiness check, hourly/retainer) linking to `/contact?offer=<slug>` (plus `work-with-us/layout.tsx`)
- `src/app/privacy/page.tsx` — Privacy policy
- `src/app/terms/page.tsx` — Terms of service
- `src/app/not-found.tsx` — Custom 404 page
- `src/app/sitemap.ts` — Generates `/sitemap.xml` (/, /services, the five /services/<slug> pages, /products, /work-with-us, /about, /contact, /privacy, /terms)
- `src/app/robots.ts` — Generates `/robots.txt` (allows all, links the sitemap)
- `src/app/opengraph-image.tsx` — 1200x630 social share image via `next/og`
- `src/app/icon.tsx`, `src/app/apple-icon.tsx`, `src/app/manifest.ts` — generated PNG icons and the web manifest
- `src/app/logo.png/route.tsx` — 512x512 logo PNG (used as the JSON-LD `logo`)
- `src/app/api/contact/route.ts` — API route handling contact form submissions via Nodemailer
- `src/app/api/chat/route.ts` — API route proxying the chat widget to OpenRouter free models with an optional Ollama Cloud fallback
- `src/app/layout.tsx` — Root layout: metadata (`metadataBase`, home canonical, OG/Twitter), viewport with themeColor, JSON-LD (Organization, WebSite, ProfessionalService with the four offers), skip-to-content link, Navbar, Footer, `ChatBotLoader` and Vercel `<Analytics />`
- Every page sets its own `alternates.canonical` and `openGraph`/`twitter` title, description and url (in its `layout.tsx`, or `page.tsx` for privacy/terms); the 404 page is `noindex`

### Component Patterns
- Most page-level data (team members, services, projects, products, testimonials) is defined as constants at the top of the respective page file.
- Interactive components use `"use client"` directive; pages are server components by default.
- `src/components/ChatBot.tsx` is an AI chat widget backed by `POST /api/chat` (OpenRouter free models, optional Ollama Cloud fallback) — not rule-based. It shows an offer-led greeting, four quick-reply chips, and renders only allowlisted URLs as clickable links. The hard-coded welcome greeting stays client-side and is never sent to the API; failures render a friendly fallback pointing to contact@willowvibe.com. When the panel opens with only the greeting it scrolls to the top; new messages auto-scroll to the bottom. A "N questions left this hour" note appears when the remaining quota is low.
- `src/components/ChatBotLoader.tsx` mounts the ChatBot with `next/dynamic` (`ssr: false`) once the browser is idle, so it doesn't block first load.
- `src/components/ContactForm.tsx` holds the contact form; only it sits inside `<Suspense>` (it reads `?offer=`), so the rest of /contact is server-rendered.
- `src/components/TrackedLink.tsx` sends Vercel Analytics events on click: `book_call_click` (booking links), `quote_click` (offer buttons); the form sends `contact_submit`.
- Home, Work with us and Products are server components. Scroll reveals use `src/components/Reveal.tsx` (IntersectionObserver + `.reveal-pending`/`.reveal-in` CSS; content is visible without JS and only hidden after mount when below the viewport); hero entrance and scanline use CSS (`.anim-fade-up`, `.anim-scan`).
- Client islands: `src/components/ProjectCarousel.tsx` (home Featured Projects: autoplay, prev/next, dots, arrow keys, lazy visuals wrapped in a local framer `MotionConfig reducedMotion="user"`) and `src/components/ProductGrid.tsx` (products cards and dialog). framer-motion is no longer loaded globally; only the carousel visuals and the About page use it.
- Project visuals rendered in the home page featured-projects carousel:
  - `src/components/AnomalyDetectionVisual.tsx` — ObservaKit (data observability)
  - `src/components/DataStreamVisual.tsx` — PipelineProbe (pipeline audit)
  - `src/components/CitationVisual.tsx` — rag-docs-chatbot (cited-answer RAG)
  - `src/components/BeforeAfterSlider.tsx` — Enterprise PLM & data migration (service)

### Styling
- **Tailwind CSS v4** with `@theme inline` syntax in `src/app/globals.css`.
- Theme background is pure black `#000000`; custom tokens: `--color-background: #000000`, `--color-primary: #00f0ff`, `--color-secondary: #7000ff`, `--color-surface: #111111`.
- Custom utility classes defined in globals.css:
  - `.glass` — frosted glass effect with backdrop blur
  - `.glass-panel` — gradient glass panel with cyan border
  - `.glow-text` — cyan text shadow
  - `.glow-border` — animated hover border with cyan glow
- globals.css also disables CSS animations/transitions under `prefers-reduced-motion: reduce` and shows a visible `:focus-visible` outline in the primary colour.
- Fonts: Geist Sans and Geist Mono via `next/font/google`.

### Security Headers (`next.config.ts`)
- `poweredByHeader: false`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `X-Frame-Options: SAMEORIGIN`
- `Permissions-Policy: camera=(), microphone=(), geolocation=()`

### Important Implementation Details
- The contact form POSTs to `/api/contact`. The route validates types and length caps (name 100, email 254, phone 40, message 5000), HTML-escapes values before building the email HTML, strips CR/LF from subject values, and returns 400 on invalid JSON or validation failure.
- The chat route validates input strictly (max 20 messages, roles `user`/`assistant` only, content 1–1000 chars after normalisation, leading assistant messages dropped so the conversation starts with a user turn) and always answers with JSON — `{ reply }` on success, `{ error }` with a friendly message on failure (raw upstream errors are never forwarded).
- Input normalisation strips control and zero-width characters, collapses runs of blank lines, trims, and forwards only the last 10 messages to the provider.
- The chat route is rate limited to 20 requests per IP per rolling hour (configurable via `CHAT_RATE_LIMIT_PER_HOUR`). `src/lib/rateLimit.ts` stores hashed-IP timestamps in Vercel Runtime Cache with a per-instance in-memory fallback, and responses carry `X-RateLimit-Limit`, `X-RateLimit-Remaining` and `X-RateLimit-Reset` headers.
- `src/lib/chatPolicy.ts` `sanitizeReply` strips think blocks, HTML/script tags, markdown images, and non-allowlisted URLs, then caps replies at 1200 chars (trimming to the last sentence boundary).
- The system prompt is built from `src/lib/offers.ts`, `src/lib/tools.ts` and `BOOKING_URL`, and includes injection-guard rules (treat visitor text as untrusted, never reveal instructions, refuse persona changes and off-topic output).
- Modals (products, services, about bio popup) use `role="dialog"`, `aria-modal`, `aria-labelledby`, close on Escape, and lock body scroll while open.
- The navbar is fixed and uses the `.glass` utility class. All pages account for its height via `pt-16 md:pt-20` on `<main>` in `layout.tsx`.
- framer-motion is used only by the carousel visuals and the About page; prefer Reveal/CSS for new animations.
