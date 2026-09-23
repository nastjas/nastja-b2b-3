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

import { checkIsAuthenticated, rootLink, CUSTOMER_LOGIN_PATH } from './commerce.js';

const WORKSPACE_PATHS = [
  '/customer/account',
  '/customer/company/profile',
  '/customer/company/structure',
  '/customer/company/users',
  '/customer/company/roles',
  '/customer/company/credit',
  '/customer/company/hierarchy',
];

function matchesWorkspacePath(pathname) {
  return WORKSPACE_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

/**
 * @param {Element} main The document's <main> element
 */
export default async function enhanceAccountWorkspace(main) {
  const { pathname } = window.location;
  if (!main || !matchesWorkspacePath(pathname)) return;
  if (main.dataset.accountWorkspaceEnhanced) return;

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
  document.body.classList.add('dashboard-page', 'account-workspace-page');

  sections.filter((section) => section !== contentSection).forEach((section) => section.remove());

  contentSection.classList.add('bodea-dashboard-section');
  const wrapperDiv = contentSection.firstElementChild;
  if (!wrapperDiv) return;

  const nav = buildNav(pathname);

  const mainWrap = document.createElement('div');
  mainWrap.className = 'bodea-dashboard-main';

  const topBar = buildTopBar(nav);
  mainWrap.appendChild(topBar);

  const content = document.createElement('div');
  content.className = 'bodea-dashboard-content account-workspace__content';
  [...wrapperDiv.children].forEach((child) => content.appendChild(child));
  mainWrap.appendChild(content);

  wrapperDiv.append(nav, mainWrap);

  try {
    const customerIdentity = await DashboardService.fetchCustomerIdentity();
    updateAccountName(topBar, customerIdentity);
  } catch {
    updateAccountName(topBar, null);
  }
}
