# Find Your Product

A parts finder inspired by the Continental "Find Your Tire" finder,
adapted for MS Motorservice. Lets a visitor narrow down by product group
and brand and/or enter a part number or vehicle, then submits to the
storefront search (`/search?q=...`).

## Content structure

Optional: a single cell whose text is used as the finder heading. The
form (product group select, brand select, free-text search, submit button)
is generated in code, so no further authoring is required.

```
| Find Your Product |
| ----------------- |
| Find your product |
```

## Behaviour

On submit the selected product group, brand and free-text term are combined
into a single query and the browser navigates to
`/search?q=<combined terms>`. Options for product groups and brands are
maintained in `find-your-product.js`.

## Styling

Navy → blue brand panel with white fields and a red (`--ms-red`) submit
button. Fields stack on mobile and align in a row on desktop. Colors come
from the brand tokens in `styles/brand.css`.
