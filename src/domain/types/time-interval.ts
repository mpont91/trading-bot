export const timeIntervalOptions = [
  'day',
  'week',
  'month',
  'year',
  'all',
] as const

export type TimeInterval = (typeof timeIntervalOptions)[number]
