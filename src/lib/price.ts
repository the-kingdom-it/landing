/** Сумма из строки цены целыми рублями: берутся только цифры («2 000 ₽» → 2000). Нет цифр – NaN. */
function amount(price: string): number {
  const digits = price.replace(/\D/g, "");
  return digits ? Number(digits) : NaN;
}

/**
 * Скидка в целых процентах: 2 000 ₽ вместо 4 000 ₽ → 50. Считается из цен, поэтому не расходится с ними.
 * Округление вниз – бейдж не обещает больше настоящей скидки.
 * null – скидки нет: старая цена не больше новой или в цене нет цифр.
 */
export function discountPercent(price: string, oldPrice: string): number | null {
  const now = amount(price);
  const before = amount(oldPrice);
  if (!Number.isFinite(now) || !Number.isFinite(before) || before <= 0 || now >= before) return null;
  return Math.floor((1 - now / before) * 100);
}
