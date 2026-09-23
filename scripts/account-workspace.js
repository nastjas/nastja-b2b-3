/**
 * Account / Company workspace shell
 *
 * The Commerce drop-in blocks for `/customer/account` and the
 * `/customer/company/*` pages (Profile, Structure, Users, Roles & Permissions,
 * Credit, Hierarchy) are authored as a classic two-column layout: a
 * `/customer/nav` fragment sidebar (30%) next to the page content (70%).
 *
 * To present these pages in the same dashboard workspace as the rest of the
 * B2B storefront (left-hand Bodea nav + shared top bar + full-width content),
 * this module runs once section content has loaded and restructures the DOM:
 * it drops the legacy fragment sidebar, marks the content section as the
 * dashboard's full-width section, and wraps the existing block markup with
 * the shared nav + top bar shell — without touching the underlying
 * commerce-* drop-in blocks themselves.
 */

import { loadCSS } from './aem.js';
import { checkIsAuthenticated, rootLink, CUSTOMER_LOGIN_PATH } from './commerce.js';

export const WORKSPACE_PATHS = [
  '/customer/account',
  '/customer/company/profile',
  '/customer/company/structure',
  '/customer/company/users',
  '/customer/company/roles',
  '/customer/company/credit',
  '/customer/company/hierarchy',
];

export function matchesWorkspacePath(pathname) {
  return WORKSPACE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * @param {Element} main The document's <main> element
 */
export default async function enhanceAccountWorkspace(main) {
  const { pathname } = window.location;
  if (!main || !matchesWorkspacePath(pathname)) return;
  if (main.dataset.accountWorkspaceEnhanced) return;

  // `scripts.js` hides `main` (body.account-workspace-pending) the moment it
  // detects one of these paths, before the old "columns" template layout can
  // paint. Whatever happens below — success, early return, or error — that
  // hide must be lifted again or the page would stay blank forever.
  try {
    if (!checkIsAuthenticated()) {
      window.location.href = rootLink(CUSTOMER_LOGIN_PATH);
      return;
    }

    let buildNav;
    let buildTopBar;
    let updateAccountName;
    let DashboardService;
    try {
      const [navMod, dashMod, svcMod] = await Promise.all([
        import('../blocks/bodea-dashboard/dashboard-nav.js'),
        import('../blocks/bodea-dashboard/bodea-dashboard.js'),
        import('../blocks/bodea-dashboard/dashboard-service.js'),
      ]);
      ({ buildNav } = navMod);
      ({ buildTopBar, updateAccountName } = dashMod);
      ({ DashboardService } = svcMod);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error('account-workspace: failed to load dashboard shell modules.', err);
      return;
    }

    // The shell markup built below (nav, top bar, section layout) is
    // constructed here in JS rather than via the normal EDS block loader, so
    // its CSS is never fetched automatically — load it explicitly and wait
    // for it before the shell is revealed, otherwise the page reveals as
    // unstyled bullet lists and raw headings for a frame.
    await loadCSS(`${window.hlx.codeBasePath}/blocks/bodea-dashboard/bodea-dashboard.css`);

    const sections = [...main.querySelectorAll(':scope > .section')];
    if (sections.length === 0) return;

    // The legacy nav sidebar section wraps a `/customer/nav` fragment block —
    // once loaded, that fragment's own markup (e.g. `.commerce-account-nav`)
    // also matches a generic "commerce-*/bodea-*" selector, so it can't be used
    // to tell the sidebar and content sections apart. The `.fragment` block
    // element itself keeps its class after loading (only its children are
    // replaced), so use that to identify — and exclude — the sidebar section.
    const isNavFragmentSection = (section) => !!section.querySelector(':scope > div > .fragment');
    const contentSection = sections.find(
      (section) => !isNavFragmentSection(section)
        && section.querySelector('[class*="commerce-"], [class*="bodea-"]'),
    );
    if (!contentSection) return;

    main.dataset.accountWorkspaceEnhanced = 'true';
    // Neutralize the CMS-authored two-column "columns" template: it's what
    // rendered `/customer/account` and `/customer/company/*` as a 30/70 split
    // with unstyled content before this shell takes over.
    document.body.classList.remove('columns');
    document.body.classList.add('dashboard-page', 'account-workspace-page');

    sections.filter((section) => section !== contentSection).forEach((section) => section.remove());

    contentSection.classList.add('bodea-dashboard-section');

    // The content section is normally authored as several stacked block rows
    // (account header, orders list, addresses, company info, ...), i.e.
    // *multiple* direct child divs — not just one. All of them need to end
    // up inside the shared dashboard content pane; leaving any behind means
    // they stay direct flex children of the section, squeezing the nav/top
    // bar shell down to a sliver instead of disappearing into the pane.
    const originalChildren = [...contentSection.children];
    if (originalChildren.length === 0) return;

    const nav = buildNav(pathname);

    const mainWrap = document.createElement('div');
    mainWrap.className = 'bodea-dashboard-main';

    const topBar = buildTopBar(nav);
    mainWrap.appendChild(topBar);

    const content = document.createElement('div');
    content.className = 'bodea-dashboard-content account-workspace__content';
    originalChildren.forEach((child) => content.appendChild(child));
    mainWrap.appendChild(content);

    // `.bodea-dashboard` is the flex shell root every other bodea-* block
    // gets for free as its own block class (`display: flex; width: 100%;
    // height: 100dvh`). This shell wrapper is plain JS-built markup, not a
    // real bodea-dashboard block, so it never gets that shell sizing unless
    // we add the class explicitly — without it `.bodea-nav`/`.bodea-dashboard-main`
    // have no flex parent and collapse to zero width.
    const shell = document.createElement('div');
    shell.className = 'bodea-dashboard account-workspace-shell';
    shell.append(nav, mainWrap);

    contentSection.appendChild(shell);

    try {
      const customerIdentity = await DashboardService.fetchCustomerIdentity();
      updateAccountName(topBar, customerIdentity);
    } catch {
      updateAccountName(topBar, null);
    }
  } finally {
    document.body.classList.remove('account-workspace-pending');
  }
}
