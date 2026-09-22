# Targeted Block

Personalized content container built on `@dropins/storefront-personalization`.
It renders its content only to visitors who match the configured audience —
customer segments, customer groups and/or cart price rules — and otherwise
collapses to nothing (no gap on the page).

On the MS Motorservice homepage it is used for the **Platinum Buyer** welcome
banner: after a Platinum customer logs in, the banner appears at the top of the
page; guests and non-Platinum customers see nothing.

## Authoring

Add a **Targeted Block** and fill the key/value rows:

| Key | Value |
|-----|-------|
| Type | `show` (show to matching audience) or `hide` |
| Customer Groups | comma-separated customer **group IDs** (e.g. the Platinum Buyer group ID) |
| Customer Segments | comma-separated customer **segment IDs** (optional) |
| Cart Rules | comma-separated cart price-rule IDs (optional) |
| Fragment | path to a content fragment (optional; otherwise the last cell is the content) |

The final cell (or the referenced fragment) holds the content to render — for the
Platinum banner an `<h3>` heading, a paragraph and a call-to-action link.

> The **Customer Groups** value must be the numeric group **ID** from
> Commerce Admin → Customers → Customer Groups, not the group name.

## Styling

Banner styling is applied via `:has(h3)` so it only takes effect when the block
actually renders content; the unmatched (empty) state stays collapsed.
