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
- Admin sessions use encrypted HTTP-only cookies with expiration
- Secrets are stored as environment variables, never committed to the repository
- Dependencies are regularly updated and audited
