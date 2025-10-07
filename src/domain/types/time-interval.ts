import { z } from 'zod'

export enum TimeInterval {
  DAY = 'day',
  WEEK = 'week',
  MONTH = 'month',
  YEAR = 'year',
  ALL = 'all',
}

export const timeIntervalSchema = z.enum(TimeInterval)
