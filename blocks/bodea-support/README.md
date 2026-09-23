# Bodea Support

Dashboard support view, rendered inside the shared dashboard shell (left nav +
top bar), matching the look of Reports/Complaints.

- **Contact information** — clearly labelled "Demo data — not a real support
  line". All phone/email/contact values are fictional placeholders for this
  demo storefront (see `DEMO_CONTACTS` in `bodea-support.js`).
- **Contact form** — accessible fields for Name, Company, Email, Phone, Topic
  and Message, with client-side validation only (required fields, email
  format). Submitting the form **does not send data anywhere** — there is no
  `fetch`/XHR call. The confirmation message explicitly states this so the
  demo never implies a real submission reached a backend.

## Authoring

1. Create a document at `/support` in Adobe Document Authoring.
2. Add a **Bodea Support** block (single empty cell).
3. Publish.

If `/support` has no authored `.bodea-support` block yet (e.g. it still has
the aem-boilerplate-commerce placeholder content), `scripts/scripts.js`
(`buildSupportPageAutoBlock`) automatically injects one so the dashboard
support view renders without requiring a content change first. Once the page
is authored with a real `Bodea Support` block, the auto-block step is skipped.

The dashboard left-nav entry points here (`dashboard-config.js` →
`PRIMARY_NAV_ITEMS`, id `support`).

## Accessibility

- Every field has an associated `<label for>`.
- Required fields are marked with `aria-required="true"` and a visible `*`.
- Form validation errors and the success message are announced via
  `role="status" aria-live="polite"`.

## Notes

- Dependency-free vanilla JS.
- Loads the dashboard shell CSS via `@import` in `bodea-support.css`.
