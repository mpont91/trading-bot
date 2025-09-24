import { Side } from '../types/side'

export function calculateTP(
  side: Side,
  price: number,
  percentage: number | undefined,
): number | undefined {
  if (!percentage) {
    return undefined
  }

  return side === Side.LONG
    ? price * (1 + percentage)
    : price * (1 - percentage)
}

export function calculateSL(
  side: Side,
  price: number,
  percentage: number | undefined,
): number | undefined {
  if (!percentage) {
    return undefined
  }

  return side === Side.LONG
    ? price * (1 - percentage)
    : price * (1 + percentage)
}

export function isTP(
  side: Side,
  price: number,
  tp: number | undefined,
): boolean {
  if (!tp) {
    return false
  }

  return (
    (side === Side.LONG && tp <= price) || (side === Side.SHORT && tp >= price)
  )
}

export function isSL(
  side: Side,
  price: number,
  sl: number | undefined,
): boolean {
  if (!sl) {
    return false
  }

  return (
    (side === Side.LONG && sl >= price) || (side === Side.SHORT && sl <= price)
  )
}
