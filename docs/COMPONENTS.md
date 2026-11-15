# Component Reference

## Layout Components

### `Navbar` (`src/components/Navbar.tsx`)
Fixed top navigation bar using the `.glass` utility class. Manages mobile menu toggle state internally. Links are defined in the `NAV_LINKS` constant.

### `Footer` (`src/components/Footer.tsx`)
Site footer with navigation links, service links, contact info, and social links. Uses `NAV_LINKS` and `SERVICE_LINKS` constants. The public contact email everywhere is contact@willowvibe.com.

### `ChatBot` (`src/components/ChatBot.tsx`)
AI chat widget backed by Claude via `POST /api/chat` — not rule-based. Sends the user conversation (excluding the client-side welcome greeting) to the API, renders the assistant reply, and shows a friendly fallback mentioning contact@willowvibe.com when the request fails. Accessibility details: the close and send buttons and the input carry `aria-label`s, the message list is `aria-live="polite"`, and Escape closes the panel. The unread counter uses a ref for the `open` state so it does not rely on a stale closure.

### `MotionProvider` (`src/components/MotionProvider.tsx`)
Client component wrapping the app in framer-motion `MotionConfig reducedMotion="user"`, so scroll/hover animations are disabled for users who prefer reduced motion.

## Project Visuals

These components are rendered inside the Featured Projects carousel on the home page. They are self-contained Framer Motion animations with no props.

### `AnomalyDetectionVisual` (`src/components/AnomalyDetectionVisual.tsx`)
Visual for **ObservaKit** — self-hosted data observability for small teams (freshness, volume and schema checks with Slack/Email/Discord/Teams/PagerDuty alerts). Animated data nodes passing through a scanner, with a red anomaly node triggering a target lock.

### `DataStreamVisual` (`src/components/DataStreamVisual.tsx`)
Visual for **PipelineProbe** — one-command read-only audit of Airflow, dbt and warehouse health producing a 0–100 score and an HTML+JSON report. Animated streaming data packets flowing from sources into a destination.

### `BeforeAfterSlider` (`src/components/BeforeAfterSlider.tsx`)
Visual for **Enterprise PLM & data migration** (service offering). Shows a "before/after" concept with animated spreadsheet rows transforming into a governed pipeline chart.

## Products Page (`src/app/products/page.tsx`)

Five product cards: ObservaKit, PipelineProbe, Doctor App, Cosmic Saju and Dikshithra Atelier. Card CTAs point to a GitHub repo, a live site, or `/contact` (Enquire) for private products. Each card opens a modal that uses `role="dialog"`, `aria-modal`, `aria-labelledby`, closes on Escape, has `aria-label="Close"` on the close button, and locks body scroll while open.

## Styling

Custom utility classes are defined in `src/app/globals.css`:

| Class          | Effect                                      |
|----------------|---------------------------------------------|
| `.glass`       | Frosted glass with backdrop blur            |
| `.glass-panel` | Gradient glass panel with cyan border       |
| `.glow-text`   | Cyan text shadow                            |
| `.glow-border` | Animated hover border with glow + lift    |

Theme tokens are declared via Tailwind CSS v4 `@theme inline` in `globals.css`:
- `--color-background: #000000`
- `--color-primary: #00f0ff`
- `--color-secondary: #7000ff`
- `--color-surface: #111111`

globals.css also includes a `prefers-reduced-motion: reduce` block that disables CSS animations/transitions, and a visible `:focus-visible` outline in the primary colour.
