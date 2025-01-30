import { TimeInterval } from '../types/time-interval'

export function getStartDateFromTimeInterval(timeInterval: TimeInterval): Date {
  const now: Date = new Date()
  let startDate: Date | undefined

  switch (timeInterval) {
    case 'day':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 1)
      break
    case 'week':
      startDate = new Date(now)
      startDate.setDate(now.getDate() - 7)
      break
    case 'month':
      startDate = new Date(now)
      startDate.setMonth(now.getMonth() - 1)
      break
    case 'year':
      startDate = new Date(now)
      startDate.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
    default:
      startDate = new Date(0)
      break
  }

  return startDate
}
