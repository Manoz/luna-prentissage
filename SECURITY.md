# Security Policy

## Supported Versions

| Version | Supported |
| ------- | --------- |
| latest  | Yes       |

## Reporting a Vulnerability

If you discover a security vulnerability in this project, please report it responsibly.

**Do not open a public issue.**

Instead, send an email to **manoz[at]outlook.com** with:

- A description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

You can expect an acknowledgment within **48 hours** and a resolution timeline within **7 days**.

## Scope

This policy covers:

- The web application (frontend and backend)
- Server API routes and authentication
- Database access and session management

Out of scope:

- Third-party services (Neon, Vercel)
- Denial of service attacks
- Social engineering

## Security Practices

- All database queries use parameterized statements (no raw string interpolation)
- Admin sessions use encrypted, HTTP-only, `SameSite=Strict` cookies with a 7-day expiration
- Sessions are bound to a fingerprint of the admin password: rotating `ADMIN_PASSWORD` (or `SESSION_SECRET`) signs every session out
- Login attempts are rate limited per IP (5 failures per 15 minutes)
- The AI tutor endpoint is rate limited per IP (20 messages per 10 minutes) and globally (400 messages per day); messages are length-limited and the history is trimmed server-side
- The Anthropic API key never leaves the server; the model only receives the app's terminology and the user's messages, and its system prompt restricts it to that scope
- State-changing admin requests must carry a same-origin `Origin` / `Sec-Fetch-Site` header
- Every request body and route parameter is validated server-side (types, required fields, length limits, numeric IDs)
- Every response carries hardening headers: `X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`, `Permissions-Policy`, `Strict-Transport-Security` and a `Content-Security-Policy` restricting `frame-ancestors`, `base-uri` and `object-src`
- Secrets are stored as environment variables, never committed to the repository
- Dependencies are regularly updated and audited
