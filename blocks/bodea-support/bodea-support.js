/**
 * Bodea Support — dashboard support view.
 *
 * Renders inside the shared dashboard shell (left nav + top bar) and shows:
 *   1. Contact information — clearly labelled as demo/placeholder data. No
 *      real support line/mailbox is wired up.
 *   2. An accessible contact form (Name, Company, Email, Phone, Topic,
 *      Message). Submitting the form performs client-side validation only —
 *      there is no backend request, and the confirmation state says so
 *      explicitly so nobody mistakes this for a real support channel.
 *
 * ── ADDING THIS PAGE ───────────────────────────────────────────────────────
 * 1. Create a document at /support in Adobe Document Authoring
 * 2. Add a "Bodea Support" block (single empty cell)
 * 3. Publish the document
 *
 * (For this demo storefront, /support is also auto-injected by
 * `scripts/scripts.js` if the page has no authored `.bodea-support` block —
 * see `buildSupportPageAutoBlock`.)
 */

import { buildNav } from '../bodea-dashboard/dashboard-nav.js';
import { buildTopBar } from '../bodea-dashboard/bodea-dashboard.js';

/* ── Demo contact data ─────────────────────────────────────────────────── */
// PLACEHOLDER: fictional demo contact details. Nothing here is a live phone
// line, mailbox, or chat endpoint — see the "Demo data" badge in the UI.
const DEMO_CONTACTS = [
  {
    icon: 'phone',
    label: 'Phone (demo)',
    value: '+1 (555) 010-2938',
    note: 'Mon–Fri, 8:00–18:00 CET — demo hours',
  },
  {
    icon: 'mail',
    label: 'Email (demo)',
    value: 'support-demo@infineon.example',
    note: 'Fictional mailbox for this demo storefront',
  },
  {
    icon: 'building',
    label: 'Account manager (demo)',
    value: 'Jordan Rivera',
    note: 'Sample contact — not a real Infineon employee',
  },
];

const TOPIC_OPTIONS = [
  { value: 'order', label: 'Order status' },
  { value: 'invoice', label: 'Invoice / billing' },
  { value: 'product', label: 'Product / technical question' },
  { value: 'account', label: 'Account / company access' },
  { value: 'other', label: 'Other' },
];

/* ── Helpers ───────────────────────────────────────────────────────────── */

const ICONS = {
  phone: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.127.96.362 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.338 1.85.573 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',
  mail: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16v16H4z"/><path d="m22 6-10 7L2 6"/></svg>',
  building: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 22V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v18"/><path d="M6 12H4a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h2"/><path d="M18 9h2a1 1 0 0 1 1 1v11a1 1 0 0 1-1 1h-2"/><path d="M10 6h4M10 10h4M10 14h4M10 18h4"/></svg>',
};

function escapeHtml(str) {
  if (str == null) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function field({
  tag, name, label, type, placeholder, required, options,
}) {
  const wrap = document.createElement('div');
  wrap.className = 'bodea-support__field';

  const lbl = document.createElement('label');
  lbl.setAttribute('for', `support-${name}`);
  lbl.innerHTML = `${escapeHtml(label)}${required ? ' <span class="bodea-support__req" aria-hidden="true">*</span>' : ''}`;

  let input;
  if (tag === 'textarea') {
    input = document.createElement('textarea');
    input.rows = 5;
  } else if (tag === 'select') {
    input = document.createElement('select');
    const blank = document.createElement('option');
    blank.value = '';
    blank.textContent = 'Select a topic…';
    input.append(blank);
    (options ?? []).forEach((opt) => {
      const optionEl = document.createElement('option');
      optionEl.value = opt.value;
      optionEl.textContent = opt.label;
      input.append(optionEl);
    });
  } else {
    input = document.createElement('input');
    input.type = type || 'text';
  }
  input.id = `support-${name}`;
  input.name = name;
  if (placeholder) input.placeholder = placeholder;
  if (required) {
    input.required = true;
    input.setAttribute('aria-required', 'true');
  }

  wrap.append(lbl, input);
  return wrap;
}

/* ── Sections ──────────────────────────────────────────────────────────── */

function buildContactCard() {
  const card = document.createElement('div');
  card.className = 'bodea-support__card bodea-support__contact-card';
  card.innerHTML = `
    <div class="bodea-support__card-head">
      <h2>Contact information</h2>
      <span class="bodea-support__demo">Demo data — not a real support line</span>
    </div>
    <ul class="bodea-support__contact-list" role="list">
      ${DEMO_CONTACTS.map((c) => `
        <li class="bodea-support__contact-item">
          <span class="bodea-support__contact-icon" aria-hidden="true">${ICONS[c.icon] ?? ''}</span>
          <div class="bodea-support__contact-body">
            <span class="bodea-support__contact-label">${escapeHtml(c.label)}</span>
            <span class="bodea-support__contact-value">${escapeHtml(c.value)}</span>
            <span class="bodea-support__contact-note">${escapeHtml(c.note)}</span>
          </div>
        </li>`).join('')}
    </ul>
  `;
  return card;
}

function buildFormCard() {
  const card = document.createElement('div');
  card.className = 'bodea-support__card bodea-support__form-card';

  const head = document.createElement('div');
  head.className = 'bodea-support__card-head';
  head.innerHTML = `
    <h2>Send us a message</h2>
    <span class="bodea-support__demo">Demo form — nothing is sent anywhere</span>
  `;
  card.append(head);

  const form = document.createElement('form');
  form.className = 'bodea-support__form';
  form.noValidate = true;

  const name = field({
    tag: 'input', name: 'name', label: 'Name', required: true,
  });
  const company = field({
    tag: 'input', name: 'company', label: 'Company',
  });
  const email = field({
    tag: 'input', name: 'email', type: 'email', label: 'Email', required: true,
  });
  const phone = field({
    tag: 'input', name: 'phone', type: 'tel', label: 'Phone',
  });
  const topic = field({
    tag: 'select', name: 'topic', label: 'Topic', required: true, options: TOPIC_OPTIONS,
  });
  const message = field({
    tag: 'textarea', name: 'message', label: 'Message', placeholder: 'How can we help?', required: true,
  });
  message.classList.add('bodea-support__field--full');

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'bodea-support__submit';
  submit.textContent = 'Send message';

  const status = document.createElement('p');
  status.className = 'bodea-support__status';
  status.setAttribute('role', 'status');
  status.setAttribute('aria-live', 'polite');

  form.append(name, company, email, phone, topic, message, submit, status);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const emailValue = (data.get('email') || '').toString().trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailValue);
    const hasMessage = (data.get('message') || '').toString().trim().length > 0;
    const valid = form.checkValidity() && validEmail && hasMessage;

    if (!valid) {
      status.textContent = 'Please fill in the required fields (name, valid email, topic, message).';
      status.className = 'bodea-support__status bodea-support__status--error';
      form.reportValidity();
      return;
    }

    // Demo only: this form does not transmit data to any backend or support
    // system. Do not remove this comment/behavior without wiring up a real
    // integration — see task requirement "no fake backend submission".
    form.querySelectorAll('input, select, textarea, button').forEach((el) => { el.disabled = true; });
    status.textContent = 'This is a demo form — your message was not sent anywhere. In the live solution this would reach our support team.';
    status.className = 'bodea-support__status bodea-support__status--ok';
  });

  card.append(form);
  return card;
}

function buildView() {
  const view = document.createElement('div');
  view.className = 'bodea-support__view';

  const header = document.createElement('div');
  header.className = 'bodea-support__header';
  header.innerHTML = `
    <h1 class="bodea-support__title">Support</h1>
    <p class="bodea-support__intro">Get in touch with our team — contact details and form below are demo placeholders for this storefront.</p>
  `;

  view.append(header, buildContactCard(), buildFormCard());
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
