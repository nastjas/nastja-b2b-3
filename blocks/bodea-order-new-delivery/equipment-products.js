/**
 * Products offered in the order wizard.
 * The SKUs are Infineon demo products. Selecting/ordering a product requires a
 * Commerce price to actually resolve for its SKU (see `fetchEquipmentSkuPrices`
 * in `equipment-prices.js`) — products without a resolved company-catalog
 * price are shown but disabled ("Not available in your company catalog").
 */
export const EQUIPMENT_PRODUCTS = [
  {
    label: 'AURIX TC375 Microcontroller',
    sku: 'INF-AURIX-TC375',
    brand: 'AURIX',
    material: 'all-season',
  },
  {
    label: 'EconoDUAL IGBT Module',
    sku: 'INF-IGBT-FF1200R12',
    brand: 'EconoDUAL',
    material: 'all-season',
  },
  {
    label: 'PSoC 6 Microcontroller',
    sku: 'INF-CYPRESS-CY8C',
    brand: 'PSoC',
    material: 'all-season',
  },
  {
    label: 'XENSIV 3D Magnetic Sensor',
    sku: 'INF-XENSIV-TLE493D',
    brand: 'XENSIV',
    material: 'all-season',
  },
  {
    label: 'OPTIGA Trust M Security Controller',
    sku: 'INF-OPTIGA-TRUST-M',
    brand: 'OPTIGA',
    material: 'summer',
  },
  {
    label: 'CoolSiC MOSFET Module',
    sku: 'INF-COOLDIM-ICE2',
    brand: 'CoolSiC',
    material: 'winter',
  },
];

export const EQUIPMENT_PRODUCT_MAP = Object.freeze(
  EQUIPMENT_PRODUCTS.reduce((products, product) => {
    products[product.sku] = product;
    return products;
  }, {}),
);

export function getEquipmentProductBySku(sku) {
  return EQUIPMENT_PRODUCT_MAP[sku] || null;
}
