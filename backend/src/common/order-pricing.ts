import { ShippingMethod } from '@prisma/client';

export type OrderPricing = {
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
};

const DEFAULT_TAX_RATE = 0.09;
const DEFAULT_FLAT_SHIPPING = 50_000;
const FREE_SHIPPING_THRESHOLD = 500_000;

export function calculateOrderPricing(
  subtotal: number,
  shippingMethod: ShippingMethod = ShippingMethod.STANDARD,
): OrderPricing {
  const taxRate = Number(process.env.ORDER_TAX_RATE ?? DEFAULT_TAX_RATE);
  const flatShipping = Number(process.env.ORDER_SHIPPING_FLAT ?? DEFAULT_FLAT_SHIPPING);
  const freeThreshold = Number(
    process.env.ORDER_FREE_SHIPPING_THRESHOLD ?? FREE_SHIPPING_THRESHOLD,
  );

  const tax = Math.round(subtotal * taxRate);
  let shipping = subtotal >= freeThreshold ? 0 : flatShipping;

  if (shippingMethod === ShippingMethod.EXPRESS) {
    shipping += Math.round(flatShipping * 0.5);
  } else if (shippingMethod === ShippingMethod.OVERNIGHT) {
    shipping += flatShipping;
  } else if (shippingMethod === ShippingMethod.PICKUP) {
    shipping = 0;
  }

  const total = subtotal + tax + shipping;

  return { subtotal, tax, shipping, total };
}
