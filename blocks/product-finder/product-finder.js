/**
 * Product Finder — "Find My Product"
 *
 * A guided Infineon product-finder page with three search entry points
 * for engineering and procurement teams
 * (RFP F-01, "search as the primary UX function"):
 *
 *   1. By number       — product number → full-text search
 *   2. By category     — product group + family + technology → search / category
 *   3. By application  — market/application/function/technology (roadmap mock)
 *
 * Results open in the existing Live Search results experience (/search or the
 * category pages), so facets, sort and pagination are reused rather than rebuilt.
 *
 * Optional authored content: the first cell is used as the page heading.
 * @param {Element} block The block element
 */

const CATEGORIES = [
  { label: 'Microcontrollers', key: 'microcontrollers' },
  { label: 'Power Semiconductors', key: 'power-semiconductors' },
  { label: 'Sensors', key: 'sensors' },
  { label: 'Connectivity', key: 'connectivity' },
  { label: 'Security Solutions', key: 'security-solutions' },
  { label: 'Memory', key: 'memory' },
];

const CATEGORIES_ENGINE = [
  { label: 'Automotive', key: 'applications/automotive' },
  { label: 'Industrial Power', key: 'applications/industrial-power' },
  { label: 'Renewable Energy', key: 'applications/renewable-energy' },
  { label: 'Consumer Electronics', key: 'applications/consumer' },
  { label: 'Internet of Things', key: 'applications/iot' },
  { label: 'Data Centers', key: 'applications/data-centers' },
];

const BRANDS = ['AURIX', 'CoolSiC', 'CoolGaN', 'XENSIV', 'OPTIGA', 'PSoC'];
const FITTING_POSITIONS = ['Silicon', 'Silicon Carbide', 'Gallium Nitride', 'MEMS'];
const VEHICLE_MAKES = ['Automotive', 'Industrial', 'Consumer', 'IoT', 'Energy', 'Data Centers'];

const RECENT_KEY = 'infineon-recent-searches';
const MAX_RECENT = 5;

function goToSearch(phrase) {
  window.location.href = `/search?q=${encodeURIComponent(phrase)}`;
}

function readRecent() {
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY)) || [];
  } catch {
    return [];
  }
}

function saveRecent(term) {
  const clean = (term || '').trim();
  if (!clean) return;
  const list = [clean, ...readRecent().filter((t) => t.toLowerCase() !== clean.toLowerCase())];
  try {
    localStorage.setItem(RECENT_KEY, JSON.stringify(list.slice(0, MAX_RECENT)));
  } catch {
    /* ignore storage errors */
  }
}

/* ── Field builders ─────────────────────────────────────────────────────── */

function buildSelect(name, label, options, allLabel) {
  const field = document.createElement('div');
  field.className = 'product-finder__field';

  const lbl = document.createElement('label');
  lbl.textContent = label;
  lbl.htmlFor = `pf-${name}`;

  const select = document.createElement('select');
  select.id = `pf-${name}`;
  select.name = name;

  const all = document.createElement('option');
  all.value = '';
  all.textContent = allLabel;
  select.append(all);

  options.forEach((opt) => {
    const o = document.createElement('option');
    o.value = typeof opt === 'string' ? opt : opt.key;
    o.textContent = typeof opt === 'string' ? opt : opt.label;
    select.append(o);
  });

  field.append(lbl, select);
  return { field, select };
}

/* ── Tab: by number ─────────────────────────────────────────────────────── */

function buildNumberTab() {
  const panel = document.createElement('div');
  panel.className = 'product-finder__panel';

  const form = document.createElement('form');
  form.className = 'product-finder__form product-finder__form--number';

  const field = document.createElement('div');
  field.className = 'product-finder__field product-finder__field--grow';
  const lbl = document.createElement('label');
  lbl.htmlFor = 'pf-number';
  lbl.textContent = 'Infineon product number';
  const input = document.createElement('input');
  input.type = 'search';
  input.id = 'pf-number';
  input.name = 'number';
  input.placeholder = 'e.g. TC375, TLE493D or FF1200R12';
  input.autocomplete = 'off';
  field.append(lbl, input);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'product-finder__submit';
  submit.textContent = 'Find products';

  form.append(field, submit);
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (!q) return;
    saveRecent(q);
    goToSearch(q);
  });

  const hint = document.createElement('p');
  hint.className = 'product-finder__hint';
  hint.textContent = 'Search by a full or partial Infineon product number or family name.';

  panel.append(form, hint);
  return panel;
}

/* ── Tab: by category & attributes ──────────────────────────────────────── */

// Product-group select with two optgroups (in-engine + around-engine)
function buildGroupSelect() {
  const field = document.createElement('div');
  field.className = 'product-finder__field';
  const lbl = document.createElement('label');
  lbl.textContent = 'Product group';
  lbl.htmlFor = 'pf-group';
  const select = document.createElement('select');
  select.id = 'pf-group';
  select.name = 'group';
  const all = document.createElement('option');
  all.value = '';
  all.textContent = 'All product groups';
  select.append(all);
  const addGroup = (label, items) => {
    const og = document.createElement('optgroup');
    og.label = label;
    items.forEach((it) => {
      const o = document.createElement('option');
      o.value = it.key;
      o.textContent = it.label;
      og.append(o);
    });
    select.append(og);
  };
  addGroup('Applications', CATEGORIES_ENGINE);
  addGroup('Product categories', CATEGORIES);
  field.append(lbl, select);
  return { field, select };
}

function buildCategoryTab() {
  const panel = document.createElement('div');
  panel.className = 'product-finder__panel';

  const form = document.createElement('form');
  form.className = 'product-finder__form product-finder__form--grid';

  const group = buildGroupSelect();
  const brand = buildSelect('brand', 'Product family', BRANDS, 'All product families');
  const fitting = buildSelect('fitting', 'Technology', FITTING_POSITIONS, 'Any technology');

  const kwField = document.createElement('div');
  kwField.className = 'product-finder__field product-finder__field--grow';
  const kwLabel = document.createElement('label');
  kwLabel.htmlFor = 'pf-keyword';
  kwLabel.textContent = 'Keyword (optional)';
  const kwInput = document.createElement('input');
  kwInput.type = 'search';
  kwInput.id = 'pf-keyword';
  kwInput.name = 'keyword';
  kwInput.placeholder = 'e.g. traction inverter, current sensor';
  kwInput.autocomplete = 'off';
  kwField.append(kwLabel, kwInput);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'product-finder__submit';
  submit.textContent = 'Show products';

  form.append(group.field, brand.field, fitting.field, kwField, submit);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const groupKey = group.select.value;
    const groupLabel = group.select.options[group.select.selectedIndex]?.text?.startsWith('All')
      ? ''
      : group.select.options[group.select.selectedIndex]?.text;
    const brandVal = brand.select.value;
    const fittingVal = fitting.select.value;
    const keyword = kwInput.value.trim();

    const extras = [brandVal, fittingVal, keyword].filter(Boolean);

    // Pure category selection → go straight to the category page (cleanest results).
    if (groupKey && extras.length === 0) {
      window.location.href = `/${groupKey}`;
      return;
    }

    // Otherwise run a full-text search combining the chosen criteria.
    const terms = [groupLabel, ...extras].filter(Boolean).join(' ').trim();
    if (!terms) return;
    saveRecent(terms);
    goToSearch(terms);
  });

  panel.append(form);
  return panel;
}

/* ── Tab: by vehicle (roadmap mock) ─────────────────────────────────────── */

function buildVehicleTab() {
  const panel = document.createElement('div');
  panel.className = 'product-finder__panel';

  const badge = document.createElement('span');
  badge.className = 'product-finder__roadmap-badge';
  badge.textContent = 'Roadmap · solution recommendation';

  const form = document.createElement('form');
  form.className = 'product-finder__form product-finder__form--grid product-finder__form--vehicle';

  const make = buildSelect('make', 'Market', VEHICLE_MAKES, 'Select market');
  const model = buildSelect('model', 'Application', [], 'Select application');
  const type = buildSelect('type', 'Function', [], 'Select function');
  const engine = buildSelect('engine', 'Technology', [], 'Select technology');
  [model, type, engine].forEach((s) => { s.select.disabled = true; });

  const submit = document.createElement('button');
  submit.type = 'button';
  submit.className = 'product-finder__submit';
  submit.textContent = 'Find a solution';
  submit.disabled = true;

  form.append(make.field, model.field, type.field, engine.field, submit);

  const note = document.createElement('p');
  note.className = 'product-finder__hint';
  note.innerHTML = 'Guided application search will recommend products by market, use case, function, and technology. Until it is connected, use part-number or category search.';

  panel.append(badge, form, note);
  return panel;
}

/* ── Chips: popular categories + recent searches ────────────────────────── */

function buildChips() {
  const wrap = document.createElement('div');
  wrap.className = 'product-finder__chips';

  const popular = document.createElement('div');
  popular.className = 'product-finder__chip-group';
  const popularLabel = document.createElement('span');
  popularLabel.className = 'product-finder__chip-label';
  popularLabel.textContent = 'Popular categories';
  popular.append(popularLabel);
  CATEGORIES.forEach((c) => {
    const a = document.createElement('a');
    a.className = 'product-finder__chip';
    a.href = `/${c.key}`;
    a.textContent = c.label;
    popular.append(a);
  });
  wrap.append(popular);

  const recent = readRecent();
  if (recent.length) {
    const recentGroup = document.createElement('div');
    recentGroup.className = 'product-finder__chip-group';
    const recentLabel = document.createElement('span');
    recentLabel.className = 'product-finder__chip-label';
    recentLabel.textContent = 'Recent searches';
    recentGroup.append(recentLabel);
    recent.forEach((term) => {
      const a = document.createElement('a');
      a.className = 'product-finder__chip product-finder__chip--recent';
      a.href = `/search?q=${encodeURIComponent(term)}`;
      a.textContent = term;
      recentGroup.append(a);
    });
    wrap.append(recentGroup);
  }

  return wrap;
}

/* ── Decorate ───────────────────────────────────────────────────────────── */

export default function decorate(block) {
  const heading = block.textContent.trim();
  block.textContent = '';
  block.classList.add('product-finder');

  if (heading) {
    const h1 = document.createElement('h1');
    h1.className = 'product-finder__title';
    h1.textContent = heading;
    block.append(h1);
  }

  const intro = document.createElement('p');
  intro.className = 'product-finder__intro';
  intro.textContent = 'Find the right Infineon semiconductor — by part number, product category, or application.';
  block.append(intro);

  const tabs = [
    { id: 'number', label: 'By number', build: buildNumberTab },
    { id: 'category', label: 'By category', build: buildCategoryTab },
    { id: 'vehicle', label: 'By application', build: buildVehicleTab },
  ];

  const tablist = document.createElement('div');
  tablist.className = 'product-finder__tabs';
  tablist.setAttribute('role', 'tablist');

  const panels = document.createElement('div');
  panels.className = 'product-finder__panels';

  tabs.forEach((tab, i) => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'product-finder__tab';
    btn.textContent = tab.label;
    btn.setAttribute('role', 'tab');
    btn.id = `pf-tab-${tab.id}`;
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');

    const panel = tab.build();
    panel.setAttribute('role', 'tabpanel');
    panel.setAttribute('aria-labelledby', btn.id);
    panel.hidden = i !== 0;

    btn.addEventListener('click', () => {
      tablist.querySelectorAll('.product-finder__tab').forEach((b) => b.setAttribute('aria-selected', 'false'));
      [...panels.children].forEach((p) => { p.hidden = true; });
      btn.setAttribute('aria-selected', 'true');
      panel.hidden = false;
    });

    tablist.append(btn);
    panels.append(panel);
  });

  block.append(tablist, panels, buildChips());

  const help = document.createElement('p');
  help.className = 'product-finder__help';
  help.innerHTML = 'Can’t find your product? <a href="/support">Contact technical support</a> and we’ll help you select the right solution.';
  block.append(help);
}
