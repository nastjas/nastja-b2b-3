# Commerce B2B Company Profile (alias)

## Overview

`commerce-b2b-company-profile` is a naming alias for the [`commerce-company-profile`](../commerce-company-profile/README.md) block.

Some authored pages (e.g. `/customer/company/profile`) reference the block name `commerce-b2b-company-profile`, while the Commerce drop-in integration is implemented once under `commerce-company-profile`. Since Edge Delivery Services resolves a block's JS/CSS purely from its CSS class name, the mismatch left the block undecorated (empty placeholder content).

This block is a thin re-export/`@import` wrapper — it has no logic of its own. All behavior, configuration, and authoring notes are documented in the `commerce-company-profile` README.

## Integration

- `commerce-b2b-company-profile.js` re-exports the default `decorate` function from `commerce-company-profile.js`.
- `commerce-b2b-company-profile.css` `@import`s `commerce-company-profile.css`.

No additional configuration is required beyond what `commerce-company-profile` documents.
