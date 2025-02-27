import { Performance } from '../types/performance'

export interface PerformanceServiceInterface {
  getPerformance(): Promise<Performance>
}
