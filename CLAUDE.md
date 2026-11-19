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
ANTHROPIC_API_KEY=your-anthropic-api-key
```

- `HOSTINGER_USER` / `HOSTINGER_PASSWORD` — required by the contact API (`src/app/api/contact/route.ts`); the transporter is created lazily and the route returns 500 with a server-side log when they are missing.
- `ANTHROPIC_API_KEY` — required by the chat API (`src/app/api/chat/route.ts`); the route returns 500 when it is missing.

These must also be configured in the Vercel dashboard under Project Settings → Environment Variables.

> **Note:** The contact API uses Hostinger SMTP (`smtp.hostinger.com:465`), not Gmail. Older documentation may reference Gmail env vars — those are obsolete.

## Architecture

### Next.js App Router
- `src/app/page.tsx` — Home page
- `src/app/about/page.tsx` — About / team page (plus `about/layout.tsx` for page metadata)
- `src/app/services/page.tsx` — Services listing (plus `services/layout.tsx`)
- `src/app/products/page.tsx` — Products page (plus `products/layout.tsx`)
- `src/app/contact/page.tsx` — Contact page with form (plus `contact/layout.tsx`); prefills the message from `?offer=<slug>`
- `src/app/work-with-us/page.tsx` — Fixed-price offers (AI pilot, pipeline audit, data stack kickoff, PLM readiness check, hourly/retainer) linking to `/contact?offer=<slug>` (plus `work-with-us/layout.tsx`)
- `src/app/privacy/page.tsx` — Privacy policy
- `src/app/terms/page.tsx` — Terms of service
- `src/app/not-found.tsx` — Custom 404 page
- `src/app/sitemap.ts` — Generates `/sitemap.xml` (/, /services, /products, /work-with-us, /about, /contact, /privacy, /terms)
- `src/app/robots.ts` — Generates `/robots.txt` (allows all, links the sitemap)
- `src/app/opengraph-image.tsx` — 1200x630 social share image via `next/og`
- `src/app/api/contact/route.ts` — API route handling contact form submissions via Nodemailer
- `src/app/api/chat/route.ts` — API route proxying the chat widget to the Anthropic Messages API
- `src/app/layout.tsx` — Root layout: metadata (`metadataBase`, canonical, Twitter card), viewport with themeColor, Organization JSON-LD, skip-to-content link, Navbar, Footer, and ChatBot

### Component Patterns
- Most page-level data (team members, services, projects, products, testimonials) is defined as constants at the top of the respective page file.
- Interactive components use `"use client"` directive; pages are server components by default.
- `src/components/ChatBot.tsx` is an AI chat widget backed by Claude through `POST /api/chat` — not rule-based. The hard-coded welcome greeting stays client-side and is never sent to the API; failures render a friendly fallback pointing to contact@willowvibe.com.
- `src/components/MotionProvider.tsx` wraps the app in framer-motion `MotionConfig reducedMotion="user"`.
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
- The chat route validates input strictly (max 20 messages, roles `user`/`assistant` only, content 1–2000 chars, leading assistant messages dropped so the conversation starts with a user turn) and always answers with JSON — `{ reply }` on success, `{ error }` with a friendly message on failure (raw upstream errors are never forwarded).
- Modals (products, services, about bio popup) use `role="dialog"`, `aria-modal`, `aria-labelledby`, close on Escape, and lock body scroll while open.
- The navbar is fixed and uses the `.glass` utility class. All pages account for its height via `pt-16 md:pt-20` on `<main>` in `layout.tsx`.
- Several components use Framer Motion for scroll and hover animations.
