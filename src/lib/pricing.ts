export function getCheckoutUnitPrice(dbPriceCents: number): number {
  return dbPriceCents / 100;
}