/**
 * Find Your Product — an Infineon semiconductor product finder.
 *
 * Optional authored content: the first cell is used as the block heading.
 * The finder itself (product group, brand, free-text search) is built in
 * code and submits to the storefront search.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const productGroups = [
    'Microcontrollers',
    'Power Semiconductors',
    'Sensors',
    'Connectivity',
    'Security Solutions',
    'Memory',
  ];
  const brands = [
    'AURIX',
    'CoolSiC',
    'CoolGaN',
    'XENSIV',
    'OPTIGA',
    'PSoC',
  ];

  const heading = block.textContent.trim();
  block.textContent = '';

  if (heading) {
    const h2 = document.createElement('h2');
    h2.className = 'find-your-product-title';
    h2.textContent = heading;
    block.append(h2);
  }

  const form = document.createElement('form');
  form.className = 'find-your-product-form';

  const buildSelect = (name, label, options, allLabel) => {
    const field = document.createElement('div');
    field.className = 'fyp-field';
    const lbl = document.createElement('label');
    lbl.textContent = label;
    lbl.htmlFor = `fyp-${name}`;
    const select = document.createElement('select');
    select.id = `fyp-${name}`;
    select.name = name;
    const all = document.createElement('option');
    all.value = '';
    all.textContent = allLabel;
    select.append(all);
    options.forEach((opt) => {
      const o = document.createElement('option');
      o.value = opt;
      o.textContent = opt;
      select.append(o);
    });
    field.append(lbl, select);
    return field;
  };

  const searchField = document.createElement('div');
  searchField.className = 'fyp-field fyp-field-search';
  const searchLabel = document.createElement('label');
  searchLabel.textContent = 'Product name or part number';
  searchLabel.htmlFor = 'fyp-q';
  const searchInput = document.createElement('input');
  searchInput.type = 'search';
  searchInput.id = 'fyp-q';
  searchInput.name = 'q';
  searchInput.placeholder = 'e.g. AURIX TC375 or TLE493D';
  searchField.append(searchLabel, searchInput);

  const submit = document.createElement('button');
  submit.type = 'submit';
  submit.className = 'fyp-submit';
  submit.textContent = 'Find products';

  form.append(
    buildSelect('group', 'Product group', productGroups, 'All product groups'),
    buildSelect('brand', 'Brand', brands, 'All brands'),
    searchField,
    submit,
  );

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const terms = [data.get('group'), data.get('brand'), data.get('q')]
      .map((v) => (v || '').trim())
      .filter(Boolean)
      .join(' ');
    window.location.href = `/search?q=${encodeURIComponent(terms)}`;
  });

  block.append(form);
}
