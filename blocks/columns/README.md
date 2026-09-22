# Columns

Lays out the cells of each row as side-by-side columns on desktop and
stacked on mobile. A cell that contains only an image is treated as an
image column. The block adds a `columns-N-cols` class based on the number
of columns in the first row.

## Content structure

One or more rows; each row's cells become columns. Typical use is a
two-column row with text in one cell and an image in the other.

## Variants

### `teaser` (MS Motorservice)

Add `teaser` to the block (author it as `Columns (teaser)`). Styles a
text/image teaser: navy headings, brand-blue "read more" links with an
arrow affix, and rounded image corners. Colors come from the brand tokens
in `styles/brand.css`.

### `footer-links` (MS Motorservice)

Used inside the footer fragment to render link groups as columns. See
`blocks/footer/README.md`.
