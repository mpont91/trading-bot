import { PredictionService } from '../../../src/domain/services/prediction-service'
import { IndicatorCreate } from '../../../src/domain/models/indicator'
import { Side } from '../../../src/domain/types/side'
import { StrategyCreate } from '../../../src/domain/models/strategy'
import {
  mockIndicatorsRulesForLeverageEvaluationSettings,
  mockIndicatorsRulesForSideEvaluationSettings,
  mockIndicatorsRulesForTPSLEvaluationSettings,
} from '../../mocks/mock-settings'

describe('PredictionService - Side Evaluation', (): void => {
  const symbol: string = 'BTCUSDT'
  const price: number = 100

  let predictionService: PredictionService

  beforeEach((): void => {
    predictionService = new PredictionService(
      mockIndicatorsRulesForSideEvaluationSettings(),
    )
  })

  it('should return long when indicators match the long rule', async (): Promise<void> => {
    const indicators: IndicatorCreate[] = [
      { name: 'RSI', period: 7, value: 35, price, symbol },
      { name: 'ADX', period: 10, value: 25, price, symbol },
      { name: 'SMA', period: 20, value: 55, price, symbol },
      { name: 'SMA', period: 50, value: 50, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.side).toBe('long')
  })

  it('should return short when indicators match the short rule', async (): Promise<void> => {
    const indicators: IndicatorCreate[] = [
      { name: 'RSI', period: 7, value: 65, price, symbol },
      { name: 'ADX', period: 10, value: 25, price, symbol },
      { name: 'SMA', period: 20, value: 45, price, symbol },
      { name: 'SMA', period: 50, value: 50, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.side).toBe('short')
  })

  it('should return hold when no rule is met', async (): Promise<void> => {
    const indicators: IndicatorCreate[] = [
      { name: 'RSI', period: 7, value: 50, price, symbol },
      { name: 'ADX', period: 10, value: 10, price, symbol },
      { name: 'SMA', period: 20, value: 50, price, symbol },
      { name: 'SMA', period: 50, value: 50, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.side).toBe('hold')
  })
})

describe('PredictionService - Leverage Evaluation', (): void => {
  const symbol: string = 'BTCUSDT'
  const price: number = 100

  let predictionService: PredictionService

  beforeEach((): void => {
    predictionService = new PredictionService(
      mockIndicatorsRulesForLeverageEvaluationSettings(),
    )
  })

  it('should return leverage of 10 when ADX is above 30', async (): Promise<void> => {
    const indicators: IndicatorCreate[] = [
      { name: 'ADX', period: 10, value: 35, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.leverage).toBe(10)
  })

  it('should return leverage of 5 when ADX is between 20 and 30', async (): Promise<void> => {
    const indicators: IndicatorCreate[] = [
      { name: 'ADX', period: 10, value: 25, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.leverage).toBe(5)
  })

  it('should return leverage of 1 when no leverage rule is met', async (): Promise<void> => {
    const indicators: IndicatorCreate[] = [
      { name: 'ADX', period: 10, value: 15, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.leverage).toBe(1)
  })
})

describe('PredictionService - TP and SL Calculation', (): void => {
  const symbol: string = 'BTCUSDT'
  const price: number = 100

  let predictionService: PredictionService

  beforeEach((): void => {
    predictionService = new PredictionService(
      mockIndicatorsRulesForTPSLEvaluationSettings(),
    )
  })

  it('should calculate TP and SL as median of ATR values', async (): Promise<void> => {
    const atr10: number = 2
    const atr14: number = 4
    const expectedTP: number = 108
    const expectedSL: number = 96

    const indicators: IndicatorCreate[] = [
      { name: 'ATR', period: 10, value: atr10, price, symbol },
      { name: 'ATR', period: 14, value: atr14, price, symbol },
      { name: 'RSI', period: 7, value: 35, price, symbol },
      { name: 'ADX', period: 10, value: 25, price, symbol },
      { name: 'SMA', period: 20, value: 55, price, symbol },
      { name: 'SMA', period: 50, value: 50, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.tp).toBe(expectedTP)
    expect(result.sl).toBe(expectedSL)
  })

  it('should limit max TP and SL values', async (): Promise<void> => {
    const atr10: number = 10
    const atr14: number = 15
    const expectedTP: number = 110
    const expectedSL: number = 92

    const indicators: IndicatorCreate[] = [
      { name: 'ATR', period: 10, value: atr10, price, symbol },
      { name: 'ATR', period: 14, value: atr14, price, symbol },
      { name: 'RSI', period: 7, value: 35, price, symbol },
      { name: 'ADX', period: 10, value: 25, price, symbol },
      { name: 'SMA', period: 20, value: 55, price, symbol },
      { name: 'SMA', period: 50, value: 50, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.tp).toBe(expectedTP)
    expect(result.sl).toBe(expectedSL)
  })

  it('should return hold if TP are smaller than the minimum', async (): Promise<void> => {
    const atr10: number = 0.1
    const atr14: number = 0.1
    const expectedTP: number | undefined = undefined
    const expectedSL: number | undefined = undefined
    const expectedLeverage: number | undefined = undefined
    const expectedSide: Side = 'hold'

    const indicators: IndicatorCreate[] = [
      { name: 'ATR', period: 10, value: atr10, price, symbol },
      { name: 'ATR', period: 14, value: atr14, price, symbol },
      { name: 'RSI', period: 7, value: 35, price, symbol },
      { name: 'ADX', period: 10, value: 25, price, symbol },
      { name: 'SMA', period: 20, value: 55, price, symbol },
      { name: 'SMA', period: 50, value: 50, price, symbol },
    ]

    const result: StrategyCreate = await predictionService.predict(indicators)
    expect(result.tp).toBe(expectedTP)
    expect(result.sl).toBe(expectedSL)
    expect(result.leverage).toBe(expectedLeverage)
    expect(result.side).toBe(expectedSide)
  })
})
