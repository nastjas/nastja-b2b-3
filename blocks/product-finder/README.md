# Product Finder ("Find My Product")

A guided parts-finder page for MS Motorservice with three search entry points,
mirroring how workshop and wholesale customers actually look for parts
(RFP F-01, "search as the primary UX function").

## Tabs

1. **By number** — article / OE / cross-reference / EAN number → full-text Live
   Search (`/search?q=…`). Partial numbers work.
2. **By category** — product group + brand + fitting position + keyword. A pure
   category selection opens the category page directly; any extra criterion runs
   a combined full-text search.
3. **By vehicle** — make → model → type → engine. Rendered as a **roadmap mock**
   (make selectable, the rest disabled) because vehicle resolution needs the
   TecDoc vehicle catalogue, which is not yet connected.

Below the tabs: **popular categories**, **recent searches** (from `localStorage`),
and a **"can't find your part?"** contact CTA (so there are no dead ends, F-01-19).

Results reuse the existing Live Search experience (`/search` and the category
pages) — facets, sort and pagination are not rebuilt here.

## Authoring

1. Create a document at `/find-your-product` in Adobe Document Authoring.
2. Add a **Product Finder** block. The first cell (optional) is used as the page
   heading, e.g. "Find My Product".
3. Publish.

## Notes

- Dependency-free (plain DOM + navigation); no dropin imports.
- Brands, categories and fitting positions are defined at the top of
  `product-finder.js`.
- When the TecDoc/vehicle data is available, wire the vehicle selects to cascade
  and route to `/search` with the resolved vehicle filter.
