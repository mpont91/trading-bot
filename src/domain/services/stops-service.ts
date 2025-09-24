import { StopsSettings } from '../types/settings'

export class StopsService {
  constructor(private readonly stopsSettings: StopsSettings) {}

  getTakeProfit(): number {
    const defaultTakeProfit = 0.05

    if (this.stopsSettings.tp) {
      return this.stopsSettings.tp
    }

    return defaultTakeProfit
  }

  getStopLoss(): number {
    const defaultStopLoss = 0.03

    if (this.stopsSettings.sl) {
      return this.stopsSettings.sl
    }

    return defaultStopLoss
  }

  getTrailingStop(): number {
    const defaultTrailingStop = 0.01

    if (this.stopsSettings.ts) {
      return this.stopsSettings.ts
    }

    return defaultTrailingStop
  }
}
