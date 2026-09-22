/**
 * Platinum Buyers welcome banner.
 *
 * Shows a slim, personalised bar directly under the navigation for customers in
 * the "Platinum Buyers" segment, e.g. "Welcome back, Marc! …".
 *
 * For the demo the segment is matched by login email (PLATINUM_EMAILS). When the
 * customer group / a personalization segment is exposed to the storefront, swap
 * the email check for the real group check in isPlatinum().
 */

import { events } from '@dropins/tools/event-bus.js';
import { CORE_FETCH_GRAPHQL, checkIsAuthenticated } from './commerce.js';

/** Login emails that belong to the Platinum Buyers group (demo control). */
const PLATINUM_EMAILS = ['marc@adobedemo.com', 'mark@adobedemo.com', 'nschutschenk@adobe.com'];

const DISMISS_KEY = 'infineon-platinum-banner-dismissed';
const IDENTITY_QUERY = 'query PlatinumIdentity { customer { firstname lastname email } }';

function isPlatinum(email) {
  if (!email) return false;
  return PLATINUM_EMAILS.map((e) => e.toLowerCase()).includes(email.toLowerCase());
}

function isDismissed() {
  try {
    return sessionStorage.getItem(DISMISS_KEY) === '1';
  } catch {
    return false;
  }
}

async function fetchIdentity() {
  try {
    const res = await CORE_FETCH_GRAPHQL.fetchGraphQl(IDENTITY_QUERY, { method: 'POST' });
    return res?.data?.customer ?? null;
  } catch {
    return null;
  }
}

function render(firstname) {
  // The body is a CSS grid (header/main/footer areas); place the banner at the
  // top of <main> so it renders directly under the navigation.
  const main = document.querySelector('main');
  if (!main || document.querySelector('.platinum-banner')) return;

  const bar = document.createElement('div');
  bar.className = 'platinum-banner';
  bar.setAttribute('role', 'region');
  bar.setAttribute('aria-label', 'Infineon Platinum Partner');
  bar.innerHTML = `
    <div class="platinum-banner__inner">
      <span class="platinum-banner__badge">Platinum</span>
      <span class="platinum-banner__text">
        Welcome back${firstname ? `, ${firstname}` : ''}! Your Platinum Partner pricing and priority support are active.
      </span>
      <a class="platinum-banner__cta" href="/dashboard">Go to your dashboard</a>
      <button class="platinum-banner__close" type="button" aria-label="Dismiss">&times;</button>
    </div>
  `;

  bar.querySelector('.platinum-banner__close').addEventListener('click', () => {
    bar.remove();
    try {
      sessionStorage.setItem(DISMISS_KEY, '1');
    } catch {
      /* ignore storage errors */
    }
  });

  main.insertAdjacentElement('afterbegin', bar);
}

/** Full-page dashboard/takeover blocks — the banner must not render over these. */
const DASHBOARD_BLOCKS = '.bodea-dashboard, .bodea-orders-list, .bodea-invoices-list, '
  + '.bodea-company-users, .bodea-address-book, .bodea-order-new-delivery, '
  + '.bodea-complaints, .bodea-reports';

/** Homepage owns its own Platinum banner via an authored `targeted-block`. */
function isHome() {
  const { pathname } = window.location;
  return pathname === '/' || pathname === '/index';
}

async function show() {
  if (isDismissed()) return;
  if (!checkIsAuthenticated()) return;
  // The homepage renders the Platinum banner as an authored targeted-block, so
  // skip the JS banner there to avoid a duplicate.
  if (isHome()) return;
  // Skip on dashboard takeover pages (they own the full viewport + greet the user themselves).
  if (document.querySelector(DASHBOARD_BLOCKS)) return;
  if (document.querySelector('.platinum-banner')) return;
  const identity = await fetchIdentity();
  if (isPlatinum(identity?.email)) {
    render(identity.firstname);
  }
}

export default function initPlatinumBanner() {
  show();
  // Re-check once auth state resolves (login during the session, late token).
  events.on('authenticated', (authed) => {
    if (authed) show();
  }, { eager: true });
}
