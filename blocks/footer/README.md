# Footer

Loads the footer content from a fragment (default `/footer`, overridable
via the `footer` metadata) and appends it into the footer block. When the
store is multi-store, it also renders a store-view switcher modal.

## Content structure

The footer fragment holds the footer content. For the MS Motorservice demo
it contains a `Columns (footer-links)` block with four link groups
(Products, Brands, Service, Company) followed by copyright and legal links.

## Styling

- `footer .columns.footer-links` — navy group headings, unstyled vertical
  link lists, brand-blue hover.
- The first paragraph after the columns (copyright) is emphasised in navy.

Colors come from the brand tokens in `styles/brand.css`.
