import { Signal } from '../types/signal'

export function calculateTP(
  signal: Signal,
  price: number,
  percentage: number | undefined,
): number | undefined {
  if (!percentage) {
    return undefined
  }

  return signal === Signal.BUY
    ? price * (1 + percentage)
    : price * (1 - percentage)
}

export function calculateSL(
  signal: Signal,
  price: number,
  percentage: number | undefined,
): number | undefined {
  if (!percentage) {
    return undefined
  }

  return signal === Signal.BUY
    ? price * (1 - percentage)
    : price * (1 + percentage)
}

export function isTP(
  signal: Signal,
  price: number,
  tp: number | undefined,
): boolean {
  if (!tp) {
    return false
  }

  return (
    (signal === Signal.BUY && tp <= price) ||
    (signal === Signal.SELL && tp >= price)
  )
}

export function isSL(
  signal: Signal,
  price: number,
  sl: number | undefined,
): boolean {
  if (!sl) {
    return false
  }

  return (
    (signal === Signal.BUY && sl >= price) ||
    (signal === Signal.SELL && sl <= price)
  )
}
