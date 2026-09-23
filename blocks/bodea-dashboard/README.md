# Bodea Dashboard Block

## Overview

The Bodea Dashboard block provides the Bodea homepage experience: left navigation, KPI cards, recent orders, stock alerts, equipment overview, and a map with delivery activity. It loads Commerce data asynchronously and replaces the standard header/footer with a full-page dashboard layout.

## DA.live Integration

- **Block name (component id)**: `bodea-dashboard` (replaces legacy `chep-dashboard`). Re-insert or swap the block in existing documents and republish so pages load the new block.
- **Type**: key-value-block
- **Rows/Columns**: Single empty cell
- Block takes over viewport; add to document at `/dashboard` or `/`

## Configuration

No section metadata. Configuration (SKUs, thresholds, nav) lives in `dashboard-config.js`.

## Architecture

- `dashboard-config.js` — SKUs, thresholds, nav items
- `dashboard-service.js` — GraphQL (orders, stock)
- `dashboard-nav.js` — Left nav rail
- `dashboard-kpi.js` — KPI cards
- `dashboard-orders.js` — Orders table
- `dashboard-stock.js` — Low stock panel
- `dashboard-equipment.js` — Equipment cards
- `dashboard-map.js` — Leaflet map, deliveries, quick actions

## Accessibility

- Uses `role="region"` and `aria-label` where appropriate
- Ensure `:focus-visible` styles on interactive elements
- Respect `prefers-reduced-motion` for map/animations

## Shared dashboard workspace shell

The left nav + top bar + full-width content pattern from this block is reused
by several other pages so that authenticated customers get one consistent
"dashboard workspace" across the storefront:

- **Bodea workspace blocks** (`bodea-reports`, `bodea-invoices-list`,
  `bodea-orders-list`, `bodea-company-users`, `bodea-address-book`,
  `bodea-order-new-delivery`, `bodea-complaints`, `bodea-support`) build the
  shell themselves in their own `decorate()`/`renderShell()` and must add
  `bodea-dashboard-section` to their block's closest `.section` — this class
  is what `bodea-dashboard.css`'s `body.dashboard-page main > .section` rule
  uses to hide every other (non-dashboard) section on the page and let the
  workspace section take up the full width.
- **Commerce drop-in pages** (`/customer/account`,
  `/customer/company/{profile,structure,users,roles,credit,hierarchy}`) are
  authored as a classic two-column layout (fragment sidebar + content), not as
  a single Bodea block. `scripts/account-workspace.js` restructures those pages
  at runtime — after section content loads — into the same nav/top-bar/content
  shell, re-using `buildNav`/`buildTopBar` from this block, without changing
  the underlying `commerce-*` drop-in blocks. See that file's header comment
  for details.
