# Product Links

Displays the classic product relationships configured in Adobe Commerce Admin.
The block reads `ProductView.links` from Catalog Service and filters the records
by `linkTypes`.

## Configuration

| Field | Required | Description |
|---|---|---|
| Type | Yes | `related`, `upsell`, or `crosssell`. |
| Heading | No | Heading shown above the product cards. |
| Maximum Items | No | Maximum cards to render. Defaults to `4`. |
| Current SKU | No | Overrides the PDP product context. Not used for cart cross-sells. |

Related and up-sell blocks use the current PDP SKU. Cross-sell blocks read every
SKU in the current cart, merge their cross-sell links, remove duplicates, and
exclude products already in the cart.

Products that are out of stock are not shown. Empty or unavailable relationship
sets hide the entire block section.

## Demo auto-blocking

Outside Universal Editor, PDPs receive Related and Up-sell blocks immediately
after Product Details, while the cart receives a Cross-sell block immediately
after Commerce Cart. Authored Product Links blocks suppress this fallback.
