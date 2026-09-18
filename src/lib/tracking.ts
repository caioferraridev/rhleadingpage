export const PURCHASE_CURRENCY = "BRL";
export const PURCHASE_CONTENT_TYPE = "product";

export function purchaseEventId(registrationId: string) {
  return `purchase_${registrationId}`;
}