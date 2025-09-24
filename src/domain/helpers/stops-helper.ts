export function calculateTP(price: number, percentage: number): number {
  return price * (1 + percentage)
}

export function calculateSL(price: number, percentage: number): number {
  return price * (1 - percentage)
}

export function isTP(price: number, tp: number): boolean {
  return tp <= price
}

export function isSL(price: number, sl: number): boolean {
  return sl >= price
}
