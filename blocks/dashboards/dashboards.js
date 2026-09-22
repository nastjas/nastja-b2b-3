/**
 * Dashboards — a grid of B2B self-service tiles linking to the storefront
 * account and company areas (orders, quotes, requisition lists, etc.).
 *
 * Content structure: one row per tile with cells
 *   | Title | Description | Link |
 * The link cell holds a single anchor whose target the whole tile links to.
 * @param {Element} block The block element
 */
export default function decorate(block) {
  const ul = document.createElement('ul');

  [...block.children].forEach((row) => {
    const cells = [...row.children];
    const titleText = (cells[0]?.textContent || '').trim();
    const descText = (cells[1]?.textContent || '').trim();
    const anchor = cells[2]?.querySelector('a');

    const li = document.createElement('li');
    li.className = 'dashboards-tile';

    const title = document.createElement('h3');
    title.textContent = titleText;
    li.append(title);

    if (descText) {
      const desc = document.createElement('p');
      desc.textContent = descText;
      li.append(desc);
    }

    if (anchor) {
      const cta = document.createElement('a');
      cta.className = 'dashboards-link';
      cta.href = anchor.getAttribute('href');
      cta.textContent = anchor.textContent.trim() || 'Open';
      li.append(cta);

      // make the whole tile clickable while keeping the visible link
      li.addEventListener('click', (event) => {
        if (event.target.closest('a')) return;
        window.location.href = cta.href;
      });
      li.classList.add('dashboards-tile-clickable');
    }

    ul.append(li);
  });

  block.replaceChildren(ul);
}
