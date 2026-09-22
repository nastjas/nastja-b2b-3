/**
 * Product Alternatives (MS Motorservice)
 *
 * Shows alternative / related products on the PDP — in particular as fallback
 * ("Ausweichprodukte") when the current product is out of stock.
 *
 * Sources (in order):
 *   1. Curated: the `ms_alternatives` product attribute (comma/space separated SKUs).
 *   2. Automatic fallback: other products from the same `ms_product_group`.
 *
 * The classic Admin-curated related/upsell/cross-sell links are NOT exposed by
 * the Catalog Service, so we drive this from a product attribute (deterministic)
 * with a same-category fallback (always populated).
 *
 * When the current product is out of stock, the block is highlighted and moved
 * above the product details so shoppers immediately see in-stock alternatives.
 *
 * Optional authored config:
 *   | Count               | max cards to show (default 4)            |
 *   | Heading             | override both headings                   |
 *   | Heading In Stock    | heading when product is in stock         |
 *   | Heading Out Of Stock| heading when product is out of stock     |
 */

import { CS_FETCH_GRAPHQL, getProductLink, getProductSku } from '../../scripts/commerce.js';
import { readBlockConfig } from '../../scripts/aem.js';

const PRODUCT_FIELDS = `
  __typename
  sku
  name
  urlKey
  inStock
  images(roles: ["thumbnail"]) { url label }
  attributes { name value }
  ... on SimpleProductView { price { final { amount { value currency } } } }
  ... on ComplexProductView { priceRange { minimum { final { amount { value currency } } } } }
`;

const BY_SKUS_QUERY = `query($skus:[String!]!){ products(skus:$skus){ ${PRODUCT_FIELDS} } }`;
const SEARCH_QUERY = `query($phrase:String!,$filter:[SearchClauseInput!],$pageSize:Int){
  productSearch(phrase:$phrase, filter:$filter, page_size:$pageSize){
    items { productView { ${PRODUCT_FIELDS} } }
  }
}`;

const DEFAULT_COUNT = 4;
const DEFAULT_HEADING_IN_STOCK = 'Similar products';
const DEFAULT_HEADING_OUT_OF_STOCK = 'Currently unavailable — available alternatives';

function getAttr(pv, name) {
  const found = pv?.attributes?.find((a) => a.name === name)?.value;
  return found == null ? undefined : String(found);
}

function getPrice(pv) {
  const amount = pv?.price?.final?.amount || pv?.priceRange?.minimum?.final?.amount;
  if (amount?.value == null) return null;
  return { value: Number(amount.value), currency: amount.currency || 'EUR' };
}

function formatMoney(price) {
  if (!price) return '';
  try {
    return new Intl.NumberFormat(document.documentElement.lang || 'en', {
      style: 'currency',
      currency: price.currency,
    }).format(price.value);
  } catch {
    return `${price.currency} ${price.value.toFixed(2)}`;
  }
}

async function fetchBySkus(skus) {
  if (!skus?.length) return [];
  const run = (method) => CS_FETCH_GRAPHQL.fetchGraphQl(BY_SKUS_QUERY, {
    method,
    variables: { skus },
    cache: 'no-store',
  });
  try {
    const res = await run('GET');
    return res?.data?.products?.filter(Boolean) ?? [];
  } catch {
    try {
      const res = await run('POST');
      return res?.data?.products?.filter(Boolean) ?? [];
    } catch {
      return [];
    }
  }
}

async function searchByGroup(group, pageSize) {
  if (!group) return [];
  try {
    const res = await CS_FETCH_GRAPHQL.fetchGraphQl(SEARCH_QUERY, {
      method: 'GET',
      variables: { phrase: '', filter: [{ attribute: 'ms_product_group', eq: group }], pageSize },
    });
    return (res?.data?.productSearch?.items ?? []).map((i) => i.productView).filter(Boolean);
  } catch {
    return [];
  }
}

function removeSelf(block) {
  const section = block.closest('.section');
  // Only drop the whole section if this block is the only block in it.
  if (section && section.querySelectorAll('[data-block-name]').length <= 1) {
    section.remove();
  } else {
    block.remove();
  }
}

function moveAboveProductDetails(block) {
  const pdSection = document.querySelector('.product-details')?.closest('.section');
  const mySection = block.closest('.section');
  if (pdSection && mySection && mySection !== pdSection && pdSection.parentElement) {
    pdSection.parentElement.insertBefore(mySection, pdSection);
  }
}

function renderCard(pv) {
  const card = document.createElement('a');
  card.className = 'product-alternatives__card';
  card.href = getProductLink(pv.urlKey, pv.sku);

  const media = document.createElement('div');
  media.className = 'product-alternatives__media';
  const imgUrl = pv.images?.[0]?.url;
  if (imgUrl) {
    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = pv.images?.[0]?.label || pv.name || '';
    img.loading = 'lazy';
    media.append(img);
  }

  const info = document.createElement('div');
  info.className = 'product-alternatives__info';

  const brand = getAttr(pv, 'ms_brand') || getAttr(pv, 'brand');
  if (brand) {
    const b = document.createElement('span');
    b.className = 'product-alternatives__brand';
    b.textContent = brand;
    info.append(b);
  }

  const name = document.createElement('span');
  name.className = 'product-alternatives__name';
  name.textContent = pv.name || pv.sku;
  info.append(name);

  const price = getPrice(pv);
  if (price) {
    const p = document.createElement('span');
    p.className = 'product-alternatives__price';
    p.textContent = formatMoney(price);
    info.append(p);
  }

  const stock = document.createElement('span');
  const inStock = pv.inStock !== false;
  stock.className = `product-alternatives__stock product-alternatives__stock--${inStock ? 'in' : 'out'}`;
  stock.textContent = inStock ? 'In stock' : 'Not available';
  info.append(stock);

  card.append(media, info);
  return card;
}

export default async function decorate(block) {
  const cfg = readBlockConfig(block);
  const maxItems = Number(cfg.count) > 0 ? Number(cfg.count) : DEFAULT_COUNT;
  block.textContent = '';

  const sku = getProductSku();
  if (!sku) {
    removeSelf(block);
    return;
  }

  const [current] = await fetchBySkus([sku]);
  if (!current) {
    removeSelf(block);
    return;
  }

  const isOutOfStock = current.inStock === false;

  // 1) Curated alternatives via attribute
  let alternatives = [];
  const curated = getAttr(current, 'ms_alternatives');
  if (curated) {
    const skus = curated
      .split(/[\s,;]+/)
      .map((s) => s.trim())
      .filter(Boolean)
      .filter((s) => s.toLowerCase() !== sku.toLowerCase());
    if (skus.length) {
      const fetched = await fetchBySkus(skus);
      // preserve authored order
      alternatives = skus
        .map((s) => fetched.find((pv) => pv.sku?.toLowerCase() === s.toLowerCase()))
        .filter(Boolean);
    }
  }

  // 2) Fallback: same product group
  if (!alternatives.length) {
    const group = getAttr(current, 'ms_product_group');
    alternatives = await searchByGroup(group, maxItems + 6);
  }

  // Exclude the current product itself
  alternatives = alternatives.filter(
    (pv) => pv?.sku && pv.sku.toLowerCase() !== sku.toLowerCase(),
  );

  // Prefer in-stock items; when the main product is out of stock only show
  // in-stock alternatives (they are the point of the fallback).
  const inStockAlts = alternatives.filter((pv) => pv.inStock !== false);
  let finalAlts;
  if (isOutOfStock) {
    finalAlts = inStockAlts;
  } else {
    finalAlts = inStockAlts.length ? inStockAlts : alternatives;
  }
  finalAlts = finalAlts.slice(0, maxItems);

  if (!finalAlts.length) {
    removeSelf(block);
    return;
  }

  block.classList.add('product-alternatives');
  if (isOutOfStock) block.classList.add('product-alternatives--priority');

  const heading = document.createElement('h2');
  heading.className = 'product-alternatives__title';
  heading.textContent = cfg.heading
    || (isOutOfStock
      ? (cfg['heading-out-of-stock'] || DEFAULT_HEADING_OUT_OF_STOCK)
      : (cfg['heading-in-stock'] || DEFAULT_HEADING_IN_STOCK));

  const grid = document.createElement('div');
  grid.className = 'product-alternatives__grid';
  finalAlts.forEach((pv) => grid.append(renderCard(pv)));

  block.append(heading, grid);

  if (isOutOfStock) moveAboveProductDetails(block);
}
