# Bodea Complaints & Returns (Mock-up)

A demonstration-only complaints / returns (RMA) workspace for the MS Motorservice
B2B demo. It renders inside the dashboard shell (left nav + top bar) like the
other dashboard subpages, but the data is **static and clearly labelled as a
mock**.

## Purpose

The requirements catalogue lists Complaints Management (F-12) as a MUST, but it
is a separately priced module that integrates with SAP and a new QS admin tool
(4 complaint types, ~30–40 status values, mandatory photo upload, barcode return
labels). This block lets the pitch **show that the requirement is understood**
without faking the full module.

## Authoring

1. Create a document at `/complaints` in Adobe Document Authoring (da.live).
2. Add a **Bodea Complaints** block (single empty cell).
3. Publish the document.

The left-nav entry for it is defined in
`blocks/bodea-dashboard/dashboard-config.js` (`NAV_ITEMS`, id `complaints`).

## Notes

- No backend calls; all rows are defined in `bodea-complaints.js` (`COMPLAINTS`).
- Buttons ("New Complaint", "Details") are intentionally disabled — it is a mock.
- Styling reuses the dashboard content shell and MS brand tokens.
