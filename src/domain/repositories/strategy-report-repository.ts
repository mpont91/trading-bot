import { StrategyReport, StrategyReportCreate } from '../models/strategy-report'

export interface StrategyReportRepository {
  create(strategyReport: StrategyReportCreate): Promise<StrategyReport>
}
