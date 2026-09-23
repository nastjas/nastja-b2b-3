/**
 * Bodea Dashboard Configuration
 *
 * Central configuration for the dashboard block. Update these values to
 * change featured equipment, stock thresholds, navigation items, and map settings.
 */

/**
 * Stock level below which an item is considered "low stock".
 * TODO: Connect to Commerce inventory threshold config when MSI API is available.
 */
export const LOW_STOCK_THRESHOLD = 250;

/**
 * REST API path prefix for the core Commerce instance (Magento store scope).
 * Used to build `GET {origin}{prefix}/V1/orders?...` alongside the GraphQL endpoint.
 * Change if your deployment uses a different store code (e.g. `/rest/all`).
 */
export const COMMERCE_REST_PATH_PREFIX = '/rest/default';

/**
 * Query string value for the spend-trend orders endpoint (rolling 12 weeks).
 */
export const SPEND_TREND_DATE_RANGE = 'rolling12w';

/** Week counts available in the dashboard spend-trend period filter (oldest → chart width). */
export const SPEND_TREND_PERIOD_OPTIONS = [4, 8, 12];

/** Default selected period (weeks) when the panel loads. */
export const DEFAULT_SPEND_TREND_WEEKS = 12;

/**
 * Featured semiconductor SKUs used for the demo dashboard.
 */
export const FEATURED_EQUIPMENT_SKUS = [
  'INF-AURIX-TC375',
  'INF-IGBT-FF1200R12',
  'INF-CYPRESS-CY8C',
  'INF-XENSIV-TLE493D',
  'INF-OPTIGA-TRUST-M',
  'INF-COOLDIM-ICE2',
];

/** Primary SKU for demo low-stock / notifications (first featured line). */
export const PRIMARY_EQUIPMENT_SKU = FEATURED_EQUIPMENT_SKUS[0];

/**
 * Product titles for Commerce name field and UI.
 */
export const EQUIPMENT_CATALOG_NAMES = {
  'INF-AURIX-TC375': 'AURIX TC375 Microcontroller',
  'INF-IGBT-FF1200R12': 'EconoDUAL IGBT Module',
  'INF-CYPRESS-CY8C': 'PSoC 6 Microcontroller',
  'INF-XENSIV-TLE493D': 'XENSIV 3D Magnetic Sensor',
  'INF-OPTIGA-TRUST-M': 'OPTIGA Trust M Security Controller',
  'INF-COOLDIM-ICE2': 'CoolSiC MOSFET Module',
};

/**
 * Dashboard card labels (same as catalog titles; fallback if Commerce name is unavailable).
 */
export const EQUIPMENT_DISPLAY_NAMES = { ...EQUIPMENT_CATALOG_NAMES };

/**
 * Demo list price (USD) per product. Used as a fallback when Commerce returns no price
 * for the SKU.
 */
export const EQUIPMENT_CATALOG_PRICES_USD = {
  'INF-AURIX-TC375': 28,
  'INF-IGBT-FF1200R12': 245,
  'INF-CYPRESS-CY8C': 19,
  'INF-XENSIV-TLE493D': 8,
  'INF-OPTIGA-TRUST-M': 12,
  'INF-COOLDIM-ICE2': 185,
};

/**
 * Legacy SKUs → canonical semiconductor demo SKUs.
 */
export const LEGACY_EQUIPMENT_SKU_MIGRATION = [
  { from: 'CHEP-UK-WOOD-1200X1000-01', to: 'INF-AURIX-TC375' },
  { from: 'CHEP-EU-WOOD-1200X800-03', to: 'INF-IGBT-FF1200R12' },
  { from: 'CHEP-WOOD-METAL-800X600-08', to: 'INF-CYPRESS-CY8C' },
  { from: 'CHEP-PLASTIC-1200X800-01120', to: 'INF-XENSIV-TLE493D' },
  { from: 'CHEP-PLASTIC-1200X1000-LIPS-00077', to: 'INF-OPTIGA-TRUST-M' },
  { from: 'CHEP-PLASTIC-QTR-600X400-16', to: 'INF-COOLDIM-ICE2' },
];

/**
 * Intermediate SKUs → canonical semiconductor demo SKUs.
 */
export const EQUIPMENT_MSY_TO_BR_SKU_MIGRATION = [
  { from: 'HCS-MSY-FAC-215102565-450', to: 'INF-AURIX-TC375' },
  { from: 'HCS-MSY-ENG-215102565-350', to: 'INF-IGBT-FF1200R12' },
  { from: 'HCS-MSY-CMU-215102565-450', to: 'INF-CYPRESS-CY8C' },
  { from: 'HCS-MSY-COM-215102565-450', to: 'INF-XENSIV-TLE493D' },
  { from: 'HCS-MSY-PRF-215102565-450', to: 'INF-OPTIGA-TRUST-M' },
  { from: 'HCS-MSY-AIR-215065-040', to: 'INF-COOLDIM-ICE2' },
];

/**
 * Placeholder stock capacity values per SKU for visual progress bars.
 *
 * DATA NOTE: Precise inventory quantities require the Magento Inventory (MSI)
 * API or a warehouse management integration. The `only_x_left_in_stock` field
 * from the products GraphQL query is used when available. These capacity values
 * are used as the denominator for the stock level bar only.
 */
export const EQUIPMENT_STOCK_CAPACITY = {
  'INF-AURIX-TC375': 2000,
  'INF-IGBT-FF1200R12': 500,
  'INF-CYPRESS-CY8C': 2500,
  'INF-XENSIV-TLE493D': 3000,
  'INF-OPTIGA-TRUST-M': 1500,
  'INF-COOLDIM-ICE2': 400,
};

/**
 * Left-hand navigation items.
 * `id` is used for active state detection (matched against pathname).
 */
export const PRIMARY_NAV_ITEMS = [
  {
    id: 'overview',
    label: 'Overview',
    href: '/dashboard',
    matchPaths: ['/dashboard'],
    icon: 'dashboard',
  },
  {
    id: 'orders',
    label: 'Orders',
    href: '/order-list',
    matchPaths: ['/order-list', '/customer/orders', '/customer/order-details'],
    icon: 'orders',
  },
  {
    id: 'invoices',
    label: 'Invoices',
    href: '/invoices',
    matchPaths: ['/invoices', '/customer/invoices'],
    icon: 'invoices',
  },
  {
    id: 'returns',
    label: 'Returns',
    href: '/customer/returns',
    matchPaths: ['/customer/returns', '/customer/return-details', '/customer/create-return'],
    icon: 'returns',
  },
  {
    id: 'reports',
    label: 'Reports',
    href: '/reports',
    matchPaths: ['/reports'],
    icon: 'reports',
  },
  {
    id: 'support',
    label: 'Support',
    href: '/support',
    matchPaths: ['/support'],
    icon: 'support',
  },
  {
    id: 'materials',
    label: 'Order Products',
    href: '/order',
    matchPaths: ['/order', '/order-new-delivery', '/equipment'],
    icon: 'materials',
  },
  {
    id: 'requisition-lists',
    label: 'Requisition Lists',
    href: '/customer/requisition-lists',
    matchPaths: ['/customer/requisition-lists', '/customer/requisition-list-view'],
    icon: 'requisitionLists',
  },
  {
    id: 'quick-order',
    label: 'Quick Order',
    /** Boilerplate B2B quick-order page (fast article-number / CSV entry). */
    href: '/quick-order',
    matchPaths: ['/quick-order'],
    icon: 'quickOrder',
  },
];

export const ACCOUNT_NAV_ITEMS = [
  {
    id: 'account',
    label: 'My Account',
    href: '/customer/account',
    matchPaths: ['/customer/account'],
    icon: 'dashboard',
  },
  {
    id: 'company-profile',
    label: 'Company Profile',
    href: '/customer/company/profile',
    matchPaths: ['/customer/company/profile'],
    icon: 'companyUsers',
  },
  {
    id: 'company-structure',
    label: 'Company Structure',
    href: '/customer/company/structure',
    matchPaths: ['/customer/company/structure'],
    icon: 'companyUsers',
  },
  {
    id: 'company-users',
    label: 'Company Users',
    href: '/customer/company/users',
    matchPaths: ['/customer/company/users', '/users'],
    icon: 'companyUsers',
  },
  {
    id: 'company-roles',
    label: 'Roles & Permissions',
    href: '/customer/company/roles',
    matchPaths: ['/customer/company/roles'],
    icon: 'companyUsers',
  },
  {
    id: 'company-credit',
    label: 'Company Credit',
    href: '/customer/company/credit',
    matchPaths: ['/customer/company/credit'],
    icon: 'invoices',
  },
  {
    id: 'company-hierarchy',
    label: 'Company Hierarchy',
    href: '/customer/company/hierarchy',
    matchPaths: ['/customer/company/hierarchy'],
    icon: 'companyUsers',
  },
];

/**
 * Quick action buttons rendered in the Quick Actions card.
 * `primary` flags the primary CTA with accent styling.
 */
export const QUICK_ACTIONS = [
  {
    id: 'create-order',
    label: 'Create New Order',
    href: '/order',
    icon: 'plus',
    primary: true,
  },
  {
    id: 'manage-inventory',
    label: 'Manage Inventory',
    href: '/customer/account',
    icon: 'inventory',
  },
  {
    id: 'view-orders',
    label: 'View All Orders',
    href: '/order-list',
    icon: 'orders',
  },
  {
    id: 'view-locations',
    label: 'View Locations',
    href: '/locations',
    icon: 'locations',
  },
];

/**
 * Map configuration.
 * Uses Leaflet.js from jsDelivr + OpenStreetMap tiles (no API key required).
 * To swap providers, update tileUrl / attribution / subdomains here.
 */
export const MAP_CONFIG = {
  /** Geographic centre of Germany / Central Europe. */
  center: [48.14, 11.58],
  zoom: 6,
};

/**
 * Optional manual map coordinates keyed by delivery site id (Commerce address uid).
 * Markers are normally resolved via OpenStreetMap Nominatim from address fields;
 * add entries here only when you need to override geocoding for a specific address.
 */
export const SITE_COORDINATES = {};

/**
 * Magento order statuses considered "active" (in-progress, not yet fulfilled).
 * Used to derive the Active Orders KPI count.
 */
export const ACTIVE_ORDER_STATUSES = [
  'pending',
  'pending_payment',
  'payment_review',
  'processing',
  'holded',
  'fraud',
];

/**
 * Magento order statuses mapped to dashboard display labels and visual variants.
 */
export const ORDER_STATUS_MAP = {
  pending: { label: 'Pending', variant: 'warning' },
  pending_payment: { label: 'Pending Payment', variant: 'warning' },
  payment_review: { label: 'Payment Review', variant: 'warning' },
  processing: { label: 'Processing', variant: 'info' },
  holded: { label: 'On Hold', variant: 'alert' },
  complete: { label: 'Complete', variant: 'positive' },
  closed: { label: 'Closed', variant: 'neutral' },
  canceled: { label: 'Cancelled', variant: 'neutral' },
  fraud: { label: 'Suspected Fraud', variant: 'alert' },
};
