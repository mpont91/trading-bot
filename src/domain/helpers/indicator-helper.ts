export function validateIndicatorKlines(
  period: number,
  pricesLength: number,
): void {
  if (pricesLength < period) {
    throw new Error('Not enough data to calculate the indicator')
  }
}

export function validateIndicatorValues(valuesLength: number): void {
  if (valuesLength <= 0) {
    throw new Error('Got no values from indicator calculation')
  }
}
