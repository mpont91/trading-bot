import { StopsSettings } from '../types/settings'

export class StopsService {
  private defaultTakeProfit: number | undefined = undefined
  private defaultStopLoss: number | undefined = 0.03
  constructor(private readonly stopsSettings: StopsSettings) {}

  getTakeProfit(): number | undefined {
    if (this.stopsSettings.tp) {
      return this.stopsSettings.tp
    }

    return this.defaultTakeProfit
  }

  getStopLoss(): number | undefined {
    if (this.stopsSettings.sl) {
      return this.stopsSettings.sl
    }

    return this.defaultStopLoss
  }
}
