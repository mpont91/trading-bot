import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'
import { TimeFrame } from '../types/candle'

export interface Strategy {
  getTimeFrame(): TimeFrame
  getCandles(): number
  calculate(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyReport | StrategyReportCreate
}
