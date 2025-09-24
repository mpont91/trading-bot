export function roundQuantity(number: number): number {
  return Math.round(number * 1e6) / 1e6
}

export function adjustQuantity(quantity: number, stepSize: number): number {
  return Math.floor(quantity / stepSize) * stepSize
}

export function median(numbers: number[]): number {
  if (numbers.length === 0) {
    throw new Error('There are no numbers to calculate the median from.')
  }

  const sorted = [...numbers].sort((a, b) => a - b)

  const mid = Math.floor(sorted.length / 2)

  return sorted.length % 2 !== 0
    ? sorted[mid]
    : (sorted[mid - 1] + sorted[mid]) / 2
}
