import { TimeInterval } from '../types/time-interval'

export function getStartTimeFromTimeInterval(timeInterval: TimeInterval): Date {
  const now: Date = new Date()
  let startTime: Date = new Date(now)

  switch (timeInterval) {
    case 'day':
      startTime.setDate(now.getDate() - 1)
      break
    case 'week':
      startTime.setDate(now.getDate() - 7)
      break
    case 'month':
      startTime.setMonth(now.getMonth() - 1)
      break
    case 'year':
      startTime.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
    default:
      startTime = new Date(0)
      break
  }

  return startTime
}
