# WillowVibe | Data Synapse — Company Website

> Official website for WillowVibe | Data Synapse, a data engineering services company.
>
> 🌐 **Live site:** [www.willowvibe.com](https://www.willowvibe.com)
> 🔧 **Staging (Vercel preview):** [willowvibe-web.vercel.app](https://willowvibe-web.vercel.app)
> 📦 **Repository:** [github.com/willowvibe/willowvibe-web](https://github.com/willowvibe/willowvibe-web)

---

## Tech Stack

| Tool | Purpose |
|---|---|
| [Next.js 16](https://nextjs.org) | React framework — App Router |
| [React 19](https://react.dev) | UI library |
| [Tailwind CSS v4](https://tailwindcss.com) | Styling |
| [Framer Motion](https://www.framer.com/motion/) | Animations |
| [Nodemailer](https://nodemailer.com) | Contact form emails (Hostinger SMTP) |
| [Anthropic Claude API](https://docs.anthropic.com) | AI chat assistant (`/api/chat`) |
| [Lucide React](https://lucide.dev) | Icons |
| [Vercel](https://vercel.com) | Hosting + auto-deploy |

---

## Project Structure

```
willowvibe-web/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Home page
│   │   ├── about/page.tsx            # About Us page (+ layout.tsx for page metadata)
│   │   ├── services/page.tsx         # Services page (+ layout.tsx for page metadata)
│   │   ├── products/page.tsx         # Products page (+ layout.tsx for page metadata)
│   │   ├── contact/page.tsx          # Contact page (+ layout.tsx for page metadata)
│   │   ├── privacy/page.tsx          # Privacy Policy page
│   │   ├── terms/page.tsx            # Terms of Service page
│   │   ├── not-found.tsx             # Custom 404 page
│   │   ├── sitemap.ts                # Generates /sitemap.xml
│   │   ├── robots.ts                 # Generates /robots.txt
│   │   ├── opengraph-image.tsx       # Social share image (1200x630, next/og)
│   │   ├── api/
│   │   │   ├── contact/route.ts      # Contact form email API (Hostinger SMTP)
│   │   │   └── chat/route.ts         # AI chat assistant API (Claude)
│   │   ├── layout.tsx                # Root layout — metadata, JSON-LD, Navbar + Footer + ChatBot
│   │   └── globals.css               # Global styles + Tailwind theme tokens
│   └── components/
│       ├── Navbar.tsx                # Top navigation bar
│       ├── Footer.tsx                # Site footer
│       ├── ChatBot.tsx               # AI chat assistant widget (Claude-backed)
│       ├── MotionProvider.tsx        # framer-motion MotionConfig (respects reduced motion)
│       ├── BeforeAfterSlider.tsx     # Enterprise PLM & data migration visual
│       ├── DataStreamVisual.tsx      # PipelineProbe visual
│       └── AnomalyDetectionVisual.tsx # ObservaKit visual
├── docs/                             # API and component documentation
├── public/                           # Static assets (images, icons)
├── .env.example                      # Environment variable template (committed)
├── .env.local                        # Secret keys — NOT committed to GitHub
├── package.json
└── README.md
```

---

## Pages Overview

### Home (`/`)
- Hero section with pipeline animation
- Trust ticker (AWS, Snowflake, Databricks...)
- The Process section with robot animation
- Core Capabilities — 4 service cards
- Featured Projects — auto-advancing scroll-snap carousel (3 projects)
- Client Endorsements — swipe carousel on mobile, grid on desktop

### Products (`/products`)
- Five cards: ObservaKit, PipelineProbe, Doctor App, Cosmic Saju, Dikshithra Atelier
- Each card opens an accessible modal (dialog semantics, Escape to close, scroll lock)
- CTAs link to GitHub repos, live client sites, or `/contact` for private products

### About (`/about`)
- Team section — flip cards in triangle on mobile, grid on desktop
- Mission statement
- Operating Principles — 3 compact blocks

### Services (`/services`)
- 8 service cards in 2-column mobile / 4-column desktop grid
- Each card links to `/contact`

### Contact (`/contact`)
- Contact info (email + LinkedIn)
- Working contact form → sends email to `contact@willowvibe.com`
- Form has loading, success, and error states

### AI Chat Assistant (all pages)
- Floating chat widget backed by Claude via `POST /api/chat`
- Friendly fallback messages on failure (contact@willowvibe.com)
- Conversation is never stored by us — messages are sent to Anthropic to generate replies

### Privacy Policy (`/privacy`) and Terms of Service (`/terms`)
- Legal pages — last updated November 2026

---

## SEO

- `src/app/layout.tsx` — metadata (`metadataBase: https://www.willowvibe.com`), canonical URLs, Open Graph/Twitter cards, viewport with `themeColor`, Organization JSON-LD
- `src/app/sitemap.ts` — lists `/`, `/services`, `/products`, `/about`, `/contact`, `/privacy`, `/terms`
- `src/app/robots.ts` — allows all crawlers, points to the sitemap
- `src/app/opengraph-image.tsx` — 1200x630 brand image via `next/og`
- Per-route `layout.tsx` files export title/description for about, services, products, contact

---

## Local Development Setup

### 1. Clone the repo
```bash
git clone https://github.com/willowvibe/willowvibe-web.git
cd willowvibe-web
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create environment file
Copy the committed template and fill in the values:
```bash
cp .env.example .env.local
```
```
HOSTINGER_USER=your-email@willowvibe.com
HOSTINGER_PASSWORD=your-hostinger-password
ANTHROPIC_API_KEY=your-anthropic-api-key
```

- `HOSTINGER_USER` / `HOSTINGER_PASSWORD` — Hostinger SMTP credentials for the contact form
- `ANTHROPIC_API_KEY` — Anthropic API key for the AI chat assistant

### 4. Run the dev server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deployment

The site auto-deploys to Vercel whenever you push to the `main` branch and goes live at **www.willowvibe.com**.

**How it works:**
- You push code to GitHub → Vercel detects it → builds and deploys automatically
- The custom domain `www.willowvibe.com` is connected to Vercel via Hostinger DNS
- The staging URL `willowvibe-web.vercel.app` always reflects the latest push too

```bash
git add .
git commit -m "your message here"
git push origin main
```

Vercel picks up the push and deploys in ~60 seconds.

### Environment Variables on Vercel
These must be added in Vercel dashboard → Project → Settings → Environment Variables:

| Variable | Purpose |
|---|---|
| `HOSTINGER_USER` | Hostinger SMTP username (contact form) |
| `HOSTINGER_PASSWORD` | Hostinger SMTP password (contact form) |
| `ANTHROPIC_API_KEY` | Anthropic API key (AI chat assistant) |

> ⚠️ Never put these in the code or commit `.env.local` to GitHub. `.env.example` is the only env file that is committed (values left empty on purpose).

---

## How to Make Common Updates

### Update team member info
File: `src/app/about/page.tsx`
Find the `TEAM` array at the top of the file. Edit `name`, `role`, `bio`, or `keywords` for each person.

### Add a team photo
In the same file, find the `FlipCard` component. Replace:
```tsx
<span className={`text-3xl font-extrabold font-mono ${t.text}`}>{member.initials}</span>
```
With:
```tsx
<img src="/photos/harish.jpg" alt={member.name} className="w-full h-full object-cover rounded-full" />
```
Put the photo file in the `public/photos/` folder.

### Update services
**Home page services (4 cards):** `src/app/page.tsx` → find `const SERVICES`
**Services page (8 cards):** `src/app/services/page.tsx` → find `const services`

### Update featured projects
File: `src/app/page.tsx`
Find `const PROJECTS` at the top and edit `title`, `desc`, `tags`, or `stat`.

### Update products
File: `src/app/products/page.tsx`
Find the products array at the top and edit `name`, `category`, `tagline`, `description`, `tags`, `status`, `link`, or `cta`.

### Update the AI chat assistant
- System prompt and model: `src/app/api/chat/route.ts`
- Widget behaviour and fallback messages: `src/components/ChatBot.tsx`

### Update contact email
File: `src/app/api/contact/route.ts`
Change the `to` address in `transporter.sendMail(...)`.

### Change brand colours
File: `src/app/globals.css`
The primary cyan colour is `--color-primary: #00f0ff`. Change this to update the glow colour across the whole site.

---

## Brand

| Item | Value |
|---|---|
| Brand name | WillowVibe \| Data Synapse |
| Primary colour | Cyan `#00f0ff` |
| Secondary colour | Purple `#7000ff` |
| Background | Black `#000000` |
| Font | Geist Sans + Geist Mono |
| Email | contact@willowvibe.com |
| LinkedIn | /company/willowvibe |

---

## Contact Form — How It Works

1. User fills in the form at `/contact`
2. Form submits to `/api/contact` (Next.js API route)
3. Server validates the fields (all strings, length caps, valid email)
4. Nodemailer sends an HTML email via Hostinger SMTP (`smtp.hostinger.com:465`)
5. Email arrives at `contact@willowvibe.com`
6. User sees a success confirmation on screen

If the form shows an error, check:
- `HOSTINGER_USER` and `HOSTINGER_PASSWORD` are set correctly in Vercel env vars
- The SMTP credentials are valid for the Hostinger mailbox

---

## AI Chat Assistant — How It Works

1. User types a question in the floating chat widget
2. Widget POSTs the conversation to `/api/chat`
3. The route validates input, drops any leading assistant turns, and calls the Anthropic Messages API (Claude Haiku)
4. Claude replies using the system prompt (services, products, client projects, contact email)
5. The reply is returned as JSON `{ reply }`; failures return `{ error }` with a friendly message
6. If `ANTHROPIC_API_KEY` is missing or the API fails, the widget shows a fallback pointing to contact@willowvibe.com

---

## Git Workflow

```bash
# Check what changed
git status

# Stage all changes
git add .

# Commit with a descriptive message
git commit -m "feat: add team photos"

# Push to GitHub → triggers Vercel auto-deploy
git push origin main
```

---

## Built and maintained by WillowVibe | Data Synapse
