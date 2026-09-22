# Product Alternatives

Shows alternative / related products on the product detail page (PDP) — designed
in particular as a fallback ("Ausweichprodukte") when the current product is
**out of stock**.

## Why this block

The classic Admin-curated **related / up-sell / cross-sell** links are **not
exposed by the Catalog Service** (verified: `relatedProducts` etc. are not
queryable on the storefront GraphQL). This block therefore drives alternatives
from product data that *is* available:

1. **Curated** — the `ms_alternatives` product attribute: a comma/space separated
   list of SKUs you pick per product (deterministic).
2. **Automatic fallback** — other products from the same `ms_product_group`
   (always populated, no maintenance needed).

## Out-of-stock behaviour

When the current product is out of stock:

- only **in-stock** alternatives are shown,
- the block is **highlighted** (red accent) with the heading
  "Currently unavailable — available alternatives", and
- it is **moved above the product details** so shoppers see the fallback first.

When the product is in stock it renders below the details as "Similar products".

If no alternatives are found the block removes itself (no empty gap).

## Authoring

Add a **Product Alternatives** block to the product template
(`/products/default`). Optional config rows:

| Key | Description | Default |
|-----|-------------|---------|
| Count | Max cards to show | 4 |
| Heading | Override both headings | — |
| Heading In Stock | Heading when product is in stock | Similar products |
| Heading Out Of Stock | Heading when product is out of stock | Currently unavailable — available alternatives |

### Curated alternatives

Create a product attribute `ms_alternatives` (text) in Commerce Admin and set it
to a comma-separated list of SKUs on any product, e.g. `MS-WPU-02, MS-KIT-WPU`.
Products with the attribute use those SKUs; all others fall back to the same
`ms_product_group`.
