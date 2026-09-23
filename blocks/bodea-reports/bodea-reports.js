/**
 * B2B reporting workspace for the Infineon demo storefront.
 *
 * Renders inside the dashboard shell (left nav + top bar) and shows the reports
 * the customer asked for (RFP F-11-08/09, F-05-36):
 *   • Backorder list
 *   • Open items ("offene Posten")
 *   • 3-year turnover overview (+ current-year breakdown by product group)
 *
 * Data is demonstration data (clearly labelled). In the real solution these
 * come from SAP (documents, open items, turnover) via the integration layer.
 *
 * ── ADDING THIS PAGE ───────────────────────────────────────────────────────
 * 1. Create a document at /reports in Adobe Document Authoring
 * 2. Add a "Bodea Reports" block (single empty cell)
 * 3. Publish the document
 */

import { buildNav } from '../bodea-dashboard/dashboard-nav.js';
import { buildTopBar } from '../bodea-dashboard/bodea-dashboard.js';

/* ── Demo data ─────────────────────────────────────────────────────────── */

const TURNOVER_YEARS = [
  { year: '2024', value: 1180000 },
  { year: '2025', value: 1340000 },
  { year: '2026 (YTD)', value: 980000 },
];

const TURNOVER_BY_GROUP = [
  { group: 'Microcontrollers', value: 210000 },
  { group: 'Power Semiconductors', value: 165000 },
  { group: 'Sensors', value: 140000 },
  { group: 'Connectivity', value: 120000 },
  { group: 'Security Solutions', value: 95000 },
  { group: 'Memory', value: 90000 },
  { group: 'Evaluation Boards', value: 60000 },
  { group: 'Other', value: 100000 },
];

const OPEN_ITEMS = [
  {
    doc: 'INV-2026-104580', date: '2026-09-05', due: '2026-10-05', amount: 7640.0, status: 'open',
  },
  {
    doc: 'INV-2026-104321', date: '2026-08-20', due: '2026-09-19', amount: 4250.0, status: 'open',
  },
  {
    doc: 'INV-2026-103980', date: '2026-07-30', due: '2026-08-29', amount: 1180.0, status: 'overdue',
  },
  {
    doc: 'CN-2026-000112', date: '2026-08-12', due: '—', amount: -320.0, status: 'credit',
  },
];

const BACKORDERS = [
  {
    name: 'CoolSiC MOSFET Module', sku: 'INF-COOLDIM-ICE2', ordered: 50, back: 20, expected: '2026-09-24',
  },
  {
    name: 'AURIX TC375 Microcontroller', sku: 'INF-AURIX-TC375', ordered: 100, back: 40, expected: '2026-09-22',
  },
  {
    name: 'XENSIV 3D Magnetic Sensor', sku: 'INF-XENSIV-TLE493D', ordered: 250, back: 80, expected: '2026-10-01',
  },
];

const STATUS_META = {
  open: { label: 'Open', variant: 'info' },
  overdue: { label: 'Overdue', variant: 'alert' },
  credit: { label: 'Credit', variant: 'positive' },
};

/* ── Helpers ───────────────────────────────────────────────────────────── */

function eur(value) {
  const sign = value < 0 ? '-' : '';
  return `${sign}€${Math.abs(value).toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

function eurShort(value) {
  if (value >= 1000000) return `€${(value / 1000000).toFixed(2)}M`;
  if (value >= 1000) return `€${Math.round(value / 1000)}k`;
  return `€${value}`;
}

function formatDate(iso) {
  if (!iso || iso === '—') return '—';
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  } catch {
    return iso;
  }
}

function escapeHtml(str) {
  if (str == null) return '';
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

/* ── Sections ──────────────────────────────────────────────────────────── */

function buildKpis() {
  const totalOpen = OPEN_ITEMS.filter((i) => i.status !== 'credit').reduce((s, i) => s + i.amount, 0);
  const overdue = OPEN_ITEMS.filter((i) => i.status === 'overdue').reduce((s, i) => s + i.amount, 0);
  const backorderUnits = BACKORDERS.reduce((s, b) => s + b.back, 0);
  const ytd = TURNOVER_YEARS[TURNOVER_YEARS.length - 1].value;

  const cards = [
    { label: 'Open items', value: eur(totalOpen), variant: 'info' },
    { label: 'Overdue', value: eur(overdue), variant: 'alert' },
    { label: 'Backordered units', value: String(backorderUnits), variant: 'warning' },
    { label: 'Turnover YTD', value: eurShort(ytd), variant: 'positive' },
  ];

  const wrap = document.createElement('div');
  wrap.className = 'bodea-reports__kpis';
  wrap.innerHTML = cards.map((c) => `
    <div class="bodea-reports__kpi bodea-reports__kpi--${c.variant}">
      <span class="bodea-reports__kpi-value">${c.value}</span>
      <span class="bodea-reports__kpi-label">${c.label}</span>
    </div>
  `).join('');
  return wrap;
}

function buildTurnover() {
  const max = Math.max(...TURNOVER_YEARS.map((y) => y.value));
  const bars = TURNOVER_YEARS.map((y) => {
    const h = Math.round((y.value / max) * 150);
    return `
      <div class="bodea-reports__bar-col">
        <span class="bodea-reports__bar-value">${eurShort(y.value)}</span>
        <div class="bodea-reports__bar" style="height:${h}px"></div>
        <span class="bodea-reports__bar-label">${y.year}</span>
      </div>`;
  }).join('');

  const rows = TURNOVER_BY_GROUP
    .slice()
    .sort((a, b) => b.value - a.value)
    .map((g) => `
      <tr>
        <td>${escapeHtml(g.group)}</td>
        <td class="bodea-reports__num">${eur(g.value)}</td>
      </tr>`).join('');

  const section = document.createElement('div');
  section.className = 'bodea-reports__card';
  section.innerHTML = `
    <div class="bodea-reports__card-head">
      <h2>Turnover — last 3 years</h2>
      <span class="bodea-reports__demo">Demo data</span>
    </div>
    <div class="bodea-reports__turnover">
      <div class="bodea-reports__chart" role="img" aria-label="Turnover per year">${bars}</div>
      <div class="bodea-reports__breakdown">
        <h3>Current year by product group</h3>
        <table class="bodea-reports__table">
          <thead><tr><th scope="col">Product group</th><th scope="col" class="bodea-reports__num">Turnover</th></tr></thead>
          <tbody>${rows}</tbody>
        </table>
      </div>
    </div>
  `;
  return section;
}

function buildOpenItems() {
  const rows = OPEN_ITEMS.map((i) => {
    const m = STATUS_META[i.status] ?? { label: i.status, variant: 'neutral' };
    return `
      <tr>
        <td>${escapeHtml(i.doc)}</td>
        <td>${formatDate(i.date)}</td>
        <td>${formatDate(i.due)}</td>
        <td class="bodea-reports__num">${eur(i.amount)}</td>
        <td><span class="bodea-reports__badge bodea-reports__badge--${m.variant}">${m.label}</span></td>
        <td><button type="button" class="bodea-reports__link" disabled>PDF</button></td>
      </tr>`;
  }).join('');

  const section = document.createElement('div');
  section.className = 'bodea-reports__card';
  section.innerHTML = `
    <div class="bodea-reports__card-head">
      <h2>Open items</h2>
      <span class="bodea-reports__demo">Demo data</span>
    </div>
    <table class="bodea-reports__table">
      <thead><tr>
        <th scope="col">Document</th><th scope="col">Date</th><th scope="col">Due</th>
        <th scope="col" class="bodea-reports__num">Amount</th><th scope="col">Status</th><th scope="col"></th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  return section;
}

function buildBackorders() {
  const rows = BACKORDERS.map((b) => `
      <tr>
        <td>
          <span class="bodea-reports__product">${escapeHtml(b.name)}</span>
          <span class="bodea-reports__sku">${escapeHtml(b.sku)}</span>
        </td>
        <td class="bodea-reports__num">${b.ordered}</td>
        <td class="bodea-reports__num">${b.back}</td>
        <td>${formatDate(b.expected)}</td>
      </tr>`).join('');

  const section = document.createElement('div');
  section.className = 'bodea-reports__card';
  section.innerHTML = `
    <div class="bodea-reports__card-head">
      <h2>Backorder list</h2>
      <span class="bodea-reports__demo">Demo data</span>
    </div>
    <table class="bodea-reports__table">
      <thead><tr>
        <th scope="col">Article</th><th scope="col" class="bodea-reports__num">Ordered</th>
        <th scope="col" class="bodea-reports__num">Backordered</th><th scope="col">Expected</th>
      </tr></thead>
      <tbody>${rows}</tbody>
    </table>
  `;
  return section;
}

function buildView() {
  const view = document.createElement('div');
  view.className = 'bodea-reports';

  const header = document.createElement('div');
  header.className = 'bodea-reports__header';
  header.innerHTML = `
    <h1 class="bodea-reports__title">Reports</h1>
    <p class="bodea-reports__intro">Backorders, open items and turnover — sourced from SAP in the live solution.</p>
  `;
  view.append(header, buildKpis(), buildTurnover(), buildOpenItems(), buildBackorders());
  return view;
}

/* ── Decorate ──────────────────────────────────────────────────────────── */

export default function decorate(block) {
  document.body.classList.add('dashboard-page');
  block.closest('.section')?.classList.add('bodea-dashboard-section');
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
