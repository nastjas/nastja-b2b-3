/**
 * Semiconductor product icon, tinted by category.
 * Shared by bodea-order-new-delivery wizard and bodea-orders-list product previews.
 * (Export name kept for backwards compatibility with existing imports.)
 *
 * @param {string} season category key (all-season | summer | winter or any)
 * @param {{ className?: string }} [opts]
 * @returns {string} SVG markup
 */
export function renderTireProductIcon(season, opts = {}) {
  const { className } = opts;
  // Accent colour per category (Infineon demo palette).
  const colors = {
    'all-season': '#0a8276',
    summer: '#ec1840',
    winter: '#1b2a41',
  };
  const accent = colors[season] || colors['all-season'];
  const classAttr = className ? ` class="${className}"` : '';
  return `<svg${classAttr} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <rect x="1" y="1" width="30" height="30" rx="7" fill="${accent}" opacity="0.12"/>
    <path d="M22 7.6a4.6 4.6 0 0 0-5.9 5.9L7.5 22.1a1.8 1.8 0 0 0 2.5 2.5l8.6-8.6A4.6 4.6 0 0 0 24.4 10l-2.7 2.7-2.2-.6-.6-2.2L22 7.6z" fill="none" stroke="${accent}" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
  </svg>`;
}
