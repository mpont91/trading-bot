export enum TimeInterval {
  Day = 'day',
  Week = 'week',
  Month = 'month',
  Year = 'year',
  All = 'all',
}

export function timeIntervalRule(value: string): asserts value is TimeInterval {
  const options: TimeInterval[] = Object.values(TimeInterval)
  if (!options.includes(value as TimeInterval)) {
    throw new Error(
      `TimeInterval parameter must be one of the following: [${options.join(', ')}]`,
    )
  }
}
