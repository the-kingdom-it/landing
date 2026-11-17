/** Сумма из строки цены: берутся только цифры («2 000 ₽» → 2000). */
function amount(price: string): number {
  return Number(price.replace(/\D/g, ""));
}

/** Скидка в целых процентах: цена 2 000 ₽ вместо 4 000 ₽ → 50. Считается из цен, поэтому не расходится с ними. */
export function discountPercent(price: string, oldPrice: string): number {
  return Math.round((1 - amount(price) / amount(oldPrice)) * 100);
}
