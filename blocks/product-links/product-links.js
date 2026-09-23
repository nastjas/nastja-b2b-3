import { events } from '@dropins/tools/event-bus.js';
import * as Cart from '@dropins/storefront-cart/api.js';
import { readBlockConfig } from '../../scripts/aem.js';
import {
  CS_FETCH_GRAPHQL,
  getProductLink,
  getProductSku,
} from '../../scripts/commerce.js';

import '../../scripts/initializers/cart.js';

const PRODUCT_FIELDS = `
  __typename
  sku
  name
  urlKey
  inStock
  images(roles: ["thumbnail"]) {
    url
    label
  }
  ... on SimpleProductView {
    price {
      final {
        amount {
          value
          currency
        }
      }
    }
  }
  ... on ComplexProductView {
    priceRange {
      minimum {
        final {
          amount {
            value
            currency
          }
        }
      }
    }
  }
`;

const PRODUCT_LINKS_QUERY = `query ProductLinks($skus: [String!]!) {
  products(skus: $skus) {
    sku
    links {
      linkTypes
      product {
        ${PRODUCT_FIELDS}
      }
    }
  }
}`;

const DEFAULT_HEADINGS = {
  related: 'Related products',
  upsell: 'You may also like',
  crosssell: 'Complete your order',
};

function normalizeType(value) {
  const type = String(value || 'related').toLowerCase().replaceAll(/[\s_-]/g, '');
  return ['related', 'upsell', 'crosssell'].includes(type) ? type : 'related';
}

function getPrice(product) {
  return product?.price?.final?.amount
    || product?.priceRange?.minimum?.final?.amount
    || null;
}

function formatPrice(price) {
  if (!price?.currency || price.value == null) return '';
  return new Intl.NumberFormat(document.documentElement.lang || 'en', {
    style: 'currency',
    currency: price.currency,
  }).format(price.value);
}

function getCartSkus(cart) {
  return [...new Set((cart?.items || [])
    .map((item) => item.topLevelSku || item.sku)
    .filter(Boolean))];
}

async function fetchProductLinks(skus, type) {
  if (!skus.length) return [];

  const response = await CS_FETCH_GRAPHQL.fetchGraphQl(PRODUCT_LINKS_QUERY, {
    method: 'GET',
    variables: { skus },
    cache: 'no-store',
  });
  const sourceSkus = new Set(skus.map((sku) => sku.toLowerCase()));
  const products = (response?.data?.products || [])
    .flatMap((product) => product.links || [])
    .filter((link) => link.linkTypes?.includes(type))
    .map((link) => link.product)
    .filter((product) => product?.sku
      && !sourceSkus.has(product.sku.toLowerCase())
      && product.inStock !== false);

  return [...new Map(products.map((product) => [product.sku, product])).values()];
}

function createCard(product) {
  const card = document.createElement('a');
  card.className = 'product-links__card';
  card.href = getProductLink(product.urlKey, product.sku);

  const media = document.createElement('span');
  media.className = 'product-links__media';
  const imageData = product.images?.[0];
  if (imageData?.url) {
    const image = document.createElement('img');
    image.src = imageData.url;
    image.alt = imageData.label || product.name || '';
    image.loading = 'lazy';
    media.append(image);
  }

  const details = document.createElement('span');
  details.className = 'product-links__details';

  const name = document.createElement('span');
  name.className = 'product-links__name';
  name.textContent = product.name || product.sku;

  const sku = document.createElement('span');
  sku.className = 'product-links__sku';
  sku.textContent = product.sku;

  details.append(name, sku);

  const price = formatPrice(getPrice(product));
  if (price) {
    const priceElement = document.createElement('span');
    priceElement.className = 'product-links__price';
    priceElement.textContent = price;
    details.append(priceElement);
  }

  card.append(media, details);
  return card;
}

function setSectionVisibility(block, visible) {
  block.hidden = !visible;
  const section = block.closest('.section');
  if (section) {
    section.classList.add('product-links-section');
    section.hidden = !visible;
  }
}

export default async function decorate(block) {
  const config = readBlockConfig(block);
  const type = normalizeType(config.type);
  const heading = config.heading || DEFAULT_HEADINGS[type];
  const configuredMaxItems = Number(config.maximumitems || config.count);
  const maxItems = Number.isFinite(configuredMaxItems)
    ? Math.min(Math.max(Math.trunc(configuredMaxItems), 1), 12)
    : 4;
  const configuredSku = config.currentsku;
  let renderVersion = 0;

  block.textContent = '';
  block.dataset.linkType = type;
  block.setAttribute('aria-live', 'polite');

  const render = async (cartData) => {
    renderVersion += 1;
    const currentVersion = renderVersion;
    const sourceSkus = type === 'crosssell'
      ? getCartSkus(cartData || Cart.getCartDataFromCache())
      : [configuredSku || getProductSku()].filter(Boolean);

    if (!sourceSkus.length) {
      setSectionVisibility(block, false);
      return;
    }

    block.setAttribute('aria-busy', 'true');

    try {
      const products = (await fetchProductLinks(sourceSkus, type)).slice(0, maxItems);
      if (currentVersion !== renderVersion) return;
      block.replaceChildren();

      if (!products.length) {
        setSectionVisibility(block, false);
        return;
      }

      const title = document.createElement('h2');
      title.className = 'product-links__heading';
      title.textContent = heading;

      const list = document.createElement('div');
      list.className = 'product-links__list';
      products.forEach((product) => list.append(createCard(product)));

      block.append(title, list);
      setSectionVisibility(block, true);
    } catch (error) {
      console.error(`Unable to load ${type} product links`, error);
      setSectionVisibility(block, false);
    } finally {
      if (currentVersion === renderVersion) block.removeAttribute('aria-busy');
    }
  };

  setSectionVisibility(block, false);

  if (type === 'crosssell') {
    events.on('cart/data', render);
    await render(Cart.getCartDataFromCache());
  } else {
    await render();
  }
}
