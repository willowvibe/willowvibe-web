# API Documentation

## Contact Form Endpoint

**Route:** `POST /api/contact`

**File:** `src/app/api/contact/route.ts`

### Request

Content-Type: `application/json`

All fields must be strings (send an empty string or omit `phone` if not provided).

| Field   | Type   | Required | Max length |
|---------|--------|----------|------------|
| name    | string | Yes      | 100        |
| email   | string | Yes      | 254        |
| phone   | string | No       | 40         |
| message | string | Yes      | 5000       |

### Validation

- Malformed JSON body → `400`
- Missing / non-string / over-length fields → `400`
- Invalid email format → `400`
- Missing `HOSTINGER_USER` / `HOSTINGER_PASSWORD` env vars → `500` (logged server-side)

Name, email, phone and message are HTML-escaped before being placed in the email HTML, and carriage returns / line feeds are stripped from values used in the subject line to prevent header and HTML injection.

### Response

**Success (200):**
```json
{ "success": true }
```

**Validation Error (400):**
```json
{ "error": "Name, email and message are required." }
```
```json
{ "error": "Please provide a valid email address." }
```
```json
{ "error": "One or more fields are too long." }
```

**Server Error (500):**
```json
{ "error": "Failed to send message. Please email us directly at contact@willowvibe.com" }
```

### Implementation Notes

- Uses Nodemailer with Hostinger SMTP (`smtp.hostinger.com:465`).
- Requires `HOSTINGER_USER` and `HOSTINGER_PASSWORD` environment variables; the transporter is created lazily so a missing configuration fails gracefully with a 500 and a server-side log instead of crashing at import time.
- Email is sent from and to the same Hostinger address (`HOSTINGER_USER`).
- The `replyTo` field is set to the submitter's email for easy replies.
- HTML email template is built inline in `buildHtml()` with brand styling.

---

## AI Chat Endpoint

**Route:** `POST /api/chat`

**File:** `src/app/api/chat/route.ts`

Forwards the conversation to a fallback chain of providers using plain `fetch` and a server-side system prompt that describes WillowVibe, its services, products and client projects (Doctor App, Cosmic Saju, Dikshithra Atelier, rag-docs-chatbot, plm-bom-pipeline) and the contact email contact@willowvibe.com.

### Provider Fallback Chain

Models are tried in order. The next model is attempted on a network error, a non-2xx response, a timeout (~15 s per attempt) or empty text:

1. OpenRouter `inclusionai/ling-3.2-flash:free`
2. OpenRouter `nvidia/nemotron-3.5-super-vl:free`
3. Ollama Cloud `glm-5.3-flash`

OpenRouter models are skipped when `OPENROUTER_API_KEY` is unset, and the Ollama model is skipped when `OLLAMA_API_KEY` is unset. If neither key is configured the route logs that and returns the friendly `500` error.

The chain can be overridden with the optional `CHAT_MODELS` environment variable, a comma-separated list of `provider:model` entries (the provider is split on the first colon only):

```bash
CHAT_MODELS=openrouter:inclusionai/ling-3.2-flash:free,ollama:glm-5.3-flash
```

Any `<think>...</think>` block is stripped from the model reply before it is returned.

### Rate Limiting

Each IP (the first `x-forwarded-for` address) is limited to `CHAT_RATE_LIMIT_PER_HOUR` requests per rolling hour, default **20**. The counter is an in-memory `Map`, so it is best-effort per serverless instance: it is not shared across instances and resets on cold starts. Requests over the limit receive `429`.

### Request

Content-Type: `application/json`

```json
{
  "messages": [
    { "role": "user", "content": "What services do you offer?" },
    { "role": "assistant", "content": "We offer PLM, data engineering and data trust services." },
    { "role": "user", "content": "How can I contact you?" }
  ]
}
```

| Field      | Type  | Rules |
|------------|-------|-------|
| `messages` | array | Required. At most **20** messages. |
| `role`     | string| Only `"user"` or `"assistant"`. |
| `content`  | string| Non-empty, at most **2000** characters. |

Any other shape → `400`. Leading assistant messages are dropped server-side so the conversation always starts with a user turn (the client keeps its hard-coded welcome greeting out of the request).

### Response

**Success (200):**
```json
{ "reply": "You can reach us at contact@willowvibe.com — we are happy to help!" }
```

**Bad Input (400):**
```json
{ "error": "Invalid messages. Send 1 to 20 user/assistant messages with non-empty content." }
```

**Rate Limited (429):**
```json
{ "error": "You've reached the chat limit for now. Please try again later or email contact@willowvibe.com" }
```

**Server / Upstream Error (500):**
```json
{ "error": "I am having trouble connecting right now. Please email us at contact@willowvibe.com" }
```

### Implementation Notes

- Configure `OPENROUTER_API_KEY` and/or `OLLAMA_API_KEY`; if neither is set the route logs it and returns the friendly `500`.
- Failed attempts are logged server-side with provider, model and status. API keys and user message content are never logged.
- The API always responds with JSON: `{ reply }` on success, `{ error }` on failure.
- Raw upstream error text is never forwarded to the client — failures map to a friendly, generic message.
- Conversation content is not stored by WillowVibe; it is sent to the selected provider solely to generate a reply.
