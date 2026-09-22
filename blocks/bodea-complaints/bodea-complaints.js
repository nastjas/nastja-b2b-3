/**
 * Bodea Complaints & Returns — MOCK-UP (RFP F-12)
 *
 * A demonstration-only view of a B2B complaints / returns (RMA) workspace.
 * It renders inside the dashboard shell (left nav + top bar) exactly like the
 * other dashboard subpages, but the data is static and clearly labelled as a
 * mock. In the real solution this area integrates with SAP and the QS admin
 * tool (30–40 status values, 4 complaint types, barcode return labels, photo
 * upload) — see the requirements catalogue F-12. This mock exists to show the
 * customer their requirement is understood, without faking the full module.
 *
 * ── ADDING THIS PAGE ───────────────────────────────────────────────────────
 * 1. Create a document at /complaints in Adobe Document Authoring
 * 2. Add a "Bodea Complaints" block (single empty cell)
 * 3. Publish the document
 */

import { buildNav } from '../bodea-dashboard/dashboard-nav.js';
import { buildTopBar } from '../bodea-dashboard/bodea-dashboard.js';

/* ── Mock data ─────────────────────────────────────────────────────────── */

const STATUS_VARIANTS = {
  new: { label: 'New', variant: 'warning' },
  review: { label: 'In Review', variant: 'info' },
  approved: { label: 'Approved', variant: 'positive' },
  credit: { label: 'Credit Issued', variant: 'positive' },
  rejected: { label: 'Rejected', variant: 'neutral' },
};

const COMPLAINTS = [
  {
    ref: 'RMA-2026-004812', date: '2026-09-08', type: 'Product defect', product: 'AURIX TC375 Microcontroller', sku: 'INF-AURIX-TC375', qty: 4, status: 'new',
  },
  {
    ref: 'RMA-2026-004798', date: '2026-09-05', type: 'Transit damage', product: 'CoolSiC MOSFET Module', sku: 'INF-COOLDIM-ICE2', qty: 1, status: 'review',
  },
  {
    ref: 'RMA-2026-004771', date: '2026-09-02', type: 'Quantity difference', product: 'OPTIGA Trust M Security Controller', sku: 'INF-OPTIGA-TRUST-M', qty: 12, status: 'approved',
  },
  {
    ref: 'RMA-2026-004755', date: '2026-08-28', type: 'Product defect', product: 'EconoDUAL IGBT Module', sku: 'INF-IGBT-FF1200R12', qty: 2, status: 'credit',
  },
  {
    ref: 'RMA-2026-004740', date: '2026-08-24', type: 'Warranty', product: 'PSoC 6 Microcontroller', sku: 'INF-CYPRESS-CY8C', qty: 1, status: 'review',
  },
  {
    ref: 'RMA-2026-004712', date: '2026-08-19', type: 'Product defect', product: 'XENSIV 3D Magnetic Sensor', sku: 'INF-XENSIV-TLE493D', qty: 3, status: 'rejected',
  },
];

/* ── Helpers ───────────────────────────────────────────────────────────── */

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

function buildSummary() {
  const counts = COMPLAINTS.reduce((acc, c) => {
    acc[c.status] = (acc[c.status] ?? 0) + 1;
    return acc;
  }, {});

  const chips = Object.entries(STATUS_VARIANTS).map(([key, meta]) => `
    <div class="bodea-complaints__chip bodea-complaints__chip--${meta.variant}">
      <span class="bodea-complaints__chip-count">${counts[key] ?? 0}</span>
      <span class="bodea-complaints__chip-label">${meta.label}</span>
    </div>
  `).join('');

  const wrap = document.createElement('div');
  wrap.className = 'bodea-complaints__summary';
  wrap.innerHTML = chips;
  return wrap;
}

function buildTable() {
  const rows = COMPLAINTS.map((c) => {
    const meta = STATUS_VARIANTS[c.status] ?? { label: c.status, variant: 'neutral' };
    return `
      <tr>
        <td data-label="Reference"><span class="bodea-complaints__ref">${escapeHtml(c.ref)}</span></td>
        <td data-label="Date">${formatDate(c.date)}</td>
        <td data-label="Type">${escapeHtml(c.type)}</td>
        <td data-label="Product">
          <span class="bodea-complaints__product">${escapeHtml(c.product)}</span>
          <span class="bodea-complaints__sku">${escapeHtml(c.sku)}</span>
        </td>
        <td data-label="Qty">${c.qty}</td>
        <td data-label="Status"><span class="bodea-complaints__badge bodea-complaints__badge--${meta.variant}">${meta.label}</span></td>
        <td data-label=""><button type="button" class="bodea-complaints__link" disabled>Details</button></td>
      </tr>
    `;
  }).join('');

  const section = document.createElement('div');
  section.className = 'bodea-complaints__table-card';
  section.innerHTML = `
    <table class="bodea-complaints__table">
      <thead>
        <tr>
          <th scope="col">Reference</th>
          <th scope="col">Date</th>
          <th scope="col">Type</th>
          <th scope="col">Product</th>
          <th scope="col">Qty</th>
          <th scope="col">Status</th>
          <th scope="col"><span class="sr-only">Actions</span></th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  return section;
}

function buildView() {
  const view = document.createElement('div');
  view.className = 'bodea-complaints';

  const header = document.createElement('div');
  header.className = 'bodea-complaints__header';
  header.innerHTML = `
    <div class="bodea-complaints__title-wrap">
      <h1 class="bodea-complaints__title">Complaints &amp; Returns</h1>
      <span class="bodea-complaints__mock-badge">Mock-up · Roadmap (F-12)</span>
    </div>
    <button type="button" class="bodea-complaints__new-btn" disabled>+ New Complaint</button>
  `;
  view.appendChild(header);

  const note = document.createElement('p');
  note.className = 'bodea-complaints__note';
  note.innerHTML = 'Demonstration view. The full Complaints Management module integrates with SAP and the QS admin tool — 4 complaint types, ~30–40 status values, mandatory photo upload, and barcode return labels.';
  view.appendChild(note);

  view.appendChild(buildSummary());
  view.appendChild(buildTable());
  return view;
}

/* ── Decorate ──────────────────────────────────────────────────────────── */

export default function decorate(block) {
  document.body.classList.add('dashboard-page');

  block.innerHTML = '';
  block.classList.add('bodea-dashboard');

  const nav = buildNav(window.location.pathname);
  block.appendChild(nav);

  const mainEl = document.createElement('div');
  mainEl.className = 'bodea-dashboard-main';

  const topBar = buildTopBar(nav);
  mainEl.appendChild(topBar);

  const content = document.createElement('div');
  content.className = 'bodea-dashboard-content';
  content.appendChild(buildView());

  mainEl.appendChild(content);
  block.appendChild(mainEl);
}
