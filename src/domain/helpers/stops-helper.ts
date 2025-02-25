import { Side } from '../types/side'

export function calculateTP(
  side: Side,
  price: number,
  percentage: number | undefined,
): number | undefined {
  if (!percentage) {
    return undefined
  }

  return side === 'long' ? price * (1 + percentage) : price * (1 - percentage)
}

export function calculateSL(
  side: Side,
  price: number,
  percentage: number | undefined,
): number | undefined {
  if (!percentage) {
    return undefined
  }

  return side === 'long' ? price * (1 - percentage) : price * (1 + percentage)
}

export function isTP(
  side: Side,
  price: number,
  tp: number | undefined,
): boolean {
  if (!tp) {
    return false
  }

  return (side === 'long' && tp <= price) || (side === 'short' && tp >= price)
}

export function isSL(
  side: Side,
  price: number,
  sl: number | undefined,
): boolean {
  if (!sl) {
    return false
  }

  return (side === 'long' && sl >= price) || (side === 'short' && sl <= price)
}
