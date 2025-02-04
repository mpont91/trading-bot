import { Performance } from '../types/performance'
import { getEmptyPerformance } from '../helpers/performance-helper'

export class PerformanceService {
  getPerformance(): Performance {
    return getEmptyPerformance()
  }
}
