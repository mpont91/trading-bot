import { IndicatorList, IndicatorListCreate } from '../models/indicator'
import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'

export interface Strategy {
  calculate(
    indicators: IndicatorList | IndicatorListCreate,
  ): StrategyReport | StrategyReportCreate
}
