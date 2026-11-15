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

Forwards the conversation to the Anthropic Messages API (model `claude-haiku-5-5`, `max_tokens: 300`) using a server-side system prompt that describes WillowVibe, its services, products and client projects (Doctor App, Cosmic Saju, Dikshithra Atelier) and the contact email contact@willowvibe.com.

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
{ "error": "Invalid messages format." }
```

**Server / Upstream Error (500):**
```json
{ "error": "The assistant is unavailable right now. Please email contact@willowvibe.com and we will get back to you." }
```

### Implementation Notes

- Requires `ANTHROPIC_API_KEY`; missing key → `500` with a friendly error (logged server-side).
- The API always responds with JSON: `{ reply }` on success, `{ error }` on failure.
- Raw upstream (Anthropic) error text is never forwarded to the client — failures map to a friendly, generic message.
- Conversation content is not stored by WillowVibe; it is sent to Anthropic solely to generate a reply.
