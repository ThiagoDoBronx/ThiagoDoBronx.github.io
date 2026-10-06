import product from '../data/product.json';

/**
 * Sends a Meta Pixel standard event. Does nothing when the pixel isn't
 * loaded (localhost, ad blockers), so callers never need to check.
 */
export function track(event, params) {
  if (typeof window.fbq === 'function') window.fbq('track', event, params);
}

/** Common product fields for e-commerce events. */
export function productParams(model) {
  return {
    content_name: `${product.name} — ${model.label}`,
    content_ids: [model.id],
    content_type: 'product',
    value: product.priceValue,
    currency: product.currency,
  };
}
