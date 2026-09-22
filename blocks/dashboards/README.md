# Dashboards

A grid of B2B self-service tiles linking to the storefront account and
company areas (orders, quotes, requisition lists, purchase orders, company
users, quick order). Gives business buyers a fast entry point to their
most-used self-service functions.

## Content structure

One row per tile with three cells:

```
| Dashboards |                                          |                 |
| ---------- | ---------------------------------------- | --------------- |
| My Orders  | Track shipments and reorder in a click.  | [Open](/order-status) |
| Quotes     | Request and manage negotiable quotes.    | [Open](/quick-order)  |
```

- **Cell 1** — tile title
- **Cell 2** — short description
- **Cell 3** — a single link; its target is used for the tile CTA and the
  whole tile is made clickable.

## Behaviour

Each tile renders as a card with a title, description and a call-to-action
link. Clicking anywhere on the tile navigates to the link target; the
visible link remains keyboard-accessible.

## Styling

White cards with a blue left accent that turns red on hover, navy titles
and brand-blue links. Colors come from the brand tokens in
`styles/brand.css`.
