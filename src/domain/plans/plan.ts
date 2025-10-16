import { Candle, TimeFrame } from '../types/candle'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'

export interface Plan {
  getSymbol(): string
  getTimeFrame(): TimeFrame
  getCandles(): number
  calculate(candles: Candle[]): StrategyReport | StrategyReportCreate
}
