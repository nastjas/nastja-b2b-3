/**
 * Bodea Dashboard — Demo Data
 *
 * Provides a realistic semiconductor procurement dataset for demos when a live
 * customer has no order history yet. This lets a specific demo persona see a
 * populated dashboard (orders, KPIs, spend trend, company credit, stock)
 * without having to place real orders in the backend.
 *
 * ── HOW TO ENABLE ──────────────────────────────────────────────────────────
 * 1. Per user (recommended for the pitch): add the persona's login email to
 *    DEMO_DASHBOARD_EMAILS below. When that customer is logged in, the
 *    dashboard shows this demo dataset automatically.
 * 2. Ad-hoc: append `?demo=1` to the dashboard URL (works for any session).
 *
 * All data here is fictitious and clearly demo-only. Remove the email(s) or
 * the query flag to return to live Commerce data.
 */

import {
  FEATURED_EQUIPMENT_SKUS,
  EQUIPMENT_DISPLAY_NAMES,
  LOW_STOCK_THRESHOLD,
} from './dashboard-config.js';
import { buildSpendTrendFromOrders } from './dashboard-service.js';

/**
 * Login emails that should always see the demo dataset on the dashboard.
 * Fill in the demo persona's email, e.g. 'lisa.becker@becker-grosshandel.de'.
 * @type {string[]}
 */
export const DEMO_DASHBOARD_EMAILS = [
  'mark@adobedemo.com',
  'nschutschenk@adobe.com',
];

const DEMO_CURRENCY = 'EUR';

/** German delivery locations for realistic order rows. */
const DEMO_LOCATIONS = [
  { company: 'Demo Electronics GmbH', city: 'München' },
  { company: 'Demo Electronics GmbH', city: 'Hamburg' },
  { company: 'Demo Electronics GmbH', city: 'Köln' },
  { company: 'Demo Electronics GmbH', city: 'Stuttgart' },
  { company: 'Demo Electronics GmbH', city: 'Frankfurt' },
  { company: 'Demo Electronics GmbH', city: 'Berlin' },
];

/** Deterministic status rotation (mostly fulfilled, some in-flight). */
const DEMO_STATUSES = [
  { status: 'complete', statusLabel: 'Complete' },
  { status: 'complete', statusLabel: 'Complete' },
  { status: 'processing', statusLabel: 'Processing' },
  { status: 'complete', statusLabel: 'Complete' },
  { status: 'pending', statusLabel: 'Pending' },
  { status: 'processing', statusLabel: 'Processing' },
];

/** Rough per-SKU unit price (EUR) for realistic order totals. */
const DEMO_PRICE_EUR = {
  'INF-AURIX-TC375': 28,
  'INF-IGBT-FF1200R12': 245,
  'INF-CYPRESS-CY8C': 19,
  'INF-XENSIV-TLE493D': 8,
  'INF-OPTIGA-TRUST-M': 12,
  'INF-COOLDIM-ICE2': 185,
};

/**
 * True when the dashboard should render the demo dataset.
 * @param {{ email?: string }|null} identity
 * @returns {boolean}
 */
export function shouldUseDemoData(identity) {
  try {
    const params = new URLSearchParams(window.location.search);
    if (params.get('demo') === '1') return true;
  } catch {
    /* ignore */
  }
  const email = identity?.email?.toLowerCase();
  return Boolean(email && DEMO_DASHBOARD_EMAILS.map((e) => e.toLowerCase()).includes(email));
}

/**
 * Build a deterministic set of demo orders spread across the last ~12 weeks.
 * @param {string} currency
 * @returns {object[]}
 */
function buildDemoOrders(currency) {
  const orders = [];
  const now = new Date();
  const skus = FEATURED_EQUIPMENT_SKUS;

  // 14 orders, one roughly every ~6 days going back in time.
  for (let i = 0; i < 14; i += 1) {
    const date = new Date(now.getTime());
    date.setDate(date.getDate() - i * 6 - 1);

    // 1–3 line items per order, rotating through the featured SKUs.
    const lineCount = (i % 3) + 1;
    const items = [];
    let value = 0;
    for (let j = 0; j < lineCount; j += 1) {
      const sku = skus[(i + j) % skus.length];
      const qty = 5 + ((i + j) % 6) * 5; // 5..30
      items.push({ name: EQUIPMENT_DISPLAY_NAMES[sku] ?? sku, sku, qty });
      value += (DEMO_PRICE_EUR[sku] ?? 100) * qty;
    }

    const loc = DEMO_LOCATIONS[i % DEMO_LOCATIONS.length];
    const st = DEMO_STATUSES[i % DEMO_STATUSES.length];

    orders.push({
      number: String(1002900 - i),
      orderDate: date.toISOString(),
      status: st.status,
      statusLabel: st.statusLabel,
      location: [loc.company, loc.city].filter(Boolean).join(' – '),
      city: loc.city,
      items,
      total: { value: Math.round(value), currency },
      primaryEquipment: items[0]?.name ?? null,
    });
  }

  return orders;
}

/**
 * Build demo stock rows for the featured SKUs, with one low-stock item.
 * @returns {object[]}
 */
function buildDemoStock() {
  const capacities = [420, 310, 480, 260, 500, 40];
  return FEATURED_EQUIPMENT_SKUS.map((sku, idx) => {
    const qty = capacities[idx % capacities.length];
    return {
      sku,
      name: EQUIPMENT_DISPLAY_NAMES[sku] ?? sku,
      stockStatus: qty > 0 ? 'IN_STOCK' : 'OUT_OF_STOCK',
      qty,
      qtyIsReal: false,
      thumbnail: null,
    };
  });
}

/**
 * Full demo dashboard dataset in the exact shapes the update functions expect.
 * @param {{ firstname?: string, lastname?: string, email?: string }|null} identity
 * @returns {{
 *   customerIdentity: object,
 *   ordersData: object,
 *   stockData: object[],
 *   spendTrendData: object,
 *   companyCreditData: object,
 * }}
 */
export function getDemoDashboardData(identity) {
  const customerIdentity = {
    firstname: identity?.firstname || 'Anna',
    lastname: identity?.lastname || 'Schmidt',
    email: identity?.email || 'anna.schmidt@demo-electronics.example',
  };

  const orders = buildDemoOrders(DEMO_CURRENCY);
  const ordersData = {
    customer: { ...customerIdentity },
    totalCount: orders.length,
    orders,
  };

  const stockData = buildDemoStock();
  // Force a visible low-stock alert on the CoolSiC module line.
  const lowIdx = stockData.findIndex((p) => p.sku === 'INF-COOLDIM-ICE2');
  if (lowIdx >= 0) stockData[lowIdx].qty = Math.max(0, Math.round(LOW_STOCK_THRESHOLD * 0.3));

  const spendTrendData = { ...buildSpendTrendFromOrders(ordersData), source: 'demo' };

  const companyCreditData = {
    creditLimit: 250000,
    outstandingBalance: 82500,
    availableCredit: 167500,
    currency: DEMO_CURRENCY,
    error: null,
    source: 'demo',
  };

  return {
    customerIdentity,
    ordersData,
    stockData,
    spendTrendData,
    companyCreditData,
  };
}
