import { IndicatorService } from './indicator-service'
import { Indicator } from '../models/indicator'
import { HOLD, Strategy } from '../types/strategy'
import { Side } from '../types/side'

export class PredictionService {
  constructor(private readonly indicatorService: IndicatorService) {}

  async predict(symbol: string): Promise<Strategy | HOLD> {
    const indicators: Indicator[] =
      await this.indicatorService.getLatestForSymbol(symbol)

    const rsi7: number = this.getIndicatorValue(indicators, 'RSI', 7)
    const rsi14: number = this.getIndicatorValue(indicators, 'RSI', 14)
    const adx10: number = this.getIndicatorValue(indicators, 'ADX', 10)
    const adx14: number = this.getIndicatorValue(indicators, 'ADX', 14)
    const atr10: number = this.getIndicatorValue(indicators, 'ATR', 10)
    const atr14: number = this.getIndicatorValue(indicators, 'ATR', 14)
    const sma20: number = this.getIndicatorValue(indicators, 'SMA', 20)
    const sma50: number = this.getIndicatorValue(indicators, 'SMA', 50)
    const lastPrice: number | null = indicators[0]?.price ?? 0

    let side: Side | null = null

    if (rsi7 < 35 && rsi14 < 40 && adx10 > 20 && sma20 > sma50) {
      side = 'long'
    } else if (rsi7 > 65 && rsi14 > 60 && adx10 > 20 && sma20 < sma50) {
      side = 'short'
    }

    if (!side) {
      return 'HOLD'
    }

    const sl: number = atr10 * 0.6 + atr14 * 0.4
    const tp: number = sl * (1.8 + atr14 / atr10)

    let leverage: number
    if (adx10 > 30 && adx14 > 30) {
      leverage = 10
    } else if (adx10 > 20 && adx14 > 20) {
      leverage = 5
    } else {
      leverage = 1
    }

    return {
      symbol,
      side,
      sl: sl,
      tp: tp,
      leverage,
      price: lastPrice,
    }
  }

  private getIndicatorValue(
    indicators: Indicator[],
    name: string,
    period: number,
  ): number {
    return (
      indicators.find((i: Indicator) => i.name === name && i.period === period)
        ?.value ?? 0
    )
  }
}
