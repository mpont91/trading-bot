import {
  TimeInterval,
  timeIntervalOptions,
} from '../../domain/types/time-interval'

export function timeIntervalRule(value: string): void {
  const options = timeIntervalOptions
  if (!options.includes(value as TimeInterval)) {
    throw new Error(
      `TimeInterval parameter must be one of the following: [${options.join(', ')}]`,
    )
  }
}
