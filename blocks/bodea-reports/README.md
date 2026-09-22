# Bodea Reports

MS Motorservice B2B reporting workspace, rendered inside the dashboard shell
(left nav + top bar). Covers the reports requested in the RFP (F-11-08/09,
F-05-36):

- **Turnover — last 3 years** (bar chart) + current-year breakdown by product group
- **Open items** ("offene Posten") with due dates, amount and status (PDF stub)
- **Backorder list** (ordered vs. backordered qty, expected date)
- KPI row: open items, overdue, backordered units, turnover YTD

Data is **demonstration data** defined at the top of `bodea-reports.js`
(`TURNOVER_YEARS`, `TURNOVER_BY_GROUP`, `OPEN_ITEMS`, `BACKORDERS`). In the live
solution these come from SAP (documents, open items, turnover) via the
integration layer.

## Authoring

1. Create a document at `/reports` in Adobe Document Authoring.
2. Add a **Bodea Reports** block (single empty cell).
3. Publish.

The dashboard left-nav entry points here (`dashboard-config.js` → `NAV_ITEMS`,
id `reports`).

## Notes

- Dependency-free vanilla JS; inline SVG-free bar chart via CSS heights.
- Loads the dashboard shell CSS via `@import` in `bodea-reports.css`.
