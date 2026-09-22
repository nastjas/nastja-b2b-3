# Request Form

Guest inquiry form (RFP F-17) for non-logged-in visitors:

- **Your request** — multi-line message (required)
- **Product / category** — selection (required)
- **Contact details** — name (required), company, email (required), phone

On submit it validates and shows a confirmation. **Demo only** — no backend
submission is wired up. In the live solution this posts a guest inquiry (logged
and routed per company, bot/DDoS-protected).

The nav entry "Request Form" is shown to guests only (auth-gated in the header
block, alongside "Register"); it is hidden for logged-in users.

## Authoring

1. Create a document at `/request-form` in Adobe Document Authoring.
2. Add a **Request Form** block. The first cell (optional) is the page heading.
3. Publish.
