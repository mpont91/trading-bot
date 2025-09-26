export enum TimeInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all',
}

export function timeIntervalRule(value: string): asserts value is TimeInterval {
  const options: TimeInterval[] = Object.values(TimeInterval)
  if (!options.includes(value as TimeInterval)) {
    throw new Error(
      `TimeInterval parameter must be one of the following: [${options.join(', ')}]`,
    )
  }
}
