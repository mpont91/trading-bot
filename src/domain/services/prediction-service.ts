import { IndicatorCreate } from '../models/indicator'
import { StrategyCreate } from '../models/strategy'
import { Side } from '../types/side'

export class PredictionService {
  async predict(indicators: IndicatorCreate[]): Promise<StrategyCreate> {
    const rsi7: number = this.getIndicatorValue(indicators, 'RSI', 7)
    const rsi14: number = this.getIndicatorValue(indicators, 'RSI', 14)
    const adx10: number = this.getIndicatorValue(indicators, 'ADX', 10)
    const adx14: number = this.getIndicatorValue(indicators, 'ADX', 14)
    const atr10: number = this.getIndicatorValue(indicators, 'ATR', 10)
    const atr14: number = this.getIndicatorValue(indicators, 'ATR', 14)
    const sma20: number = this.getIndicatorValue(indicators, 'SMA', 20)
    const sma50: number = this.getIndicatorValue(indicators, 'SMA', 50)
    const lastPrice: number = indicators[0].price!
    const symbol: string = indicators[0].symbol!

    let side: Side = 'hold'
    let sl: number | undefined = undefined
    let tp: number | undefined = undefined
    let leverage: number | undefined = undefined

    if (rsi7 < 35 && rsi14 < 40 && adx10 > 20 && sma20 > sma50) {
      side = 'long'
    } else if (rsi7 > 65 && rsi14 > 60 && adx10 > 20 && sma20 < sma50) {
      side = 'short'
    }

    if (side !== 'hold') {
      sl = atr10 * 0.6 + atr14 * 0.4
      tp = sl * (1.8 + atr14 / atr10)

      if (adx10 > 30 && adx14 > 30) {
        leverage = 10
      } else if (adx10 > 20 && adx14 > 20) {
        leverage = 5
      } else {
        leverage = 1
      }
    }

    return {
      symbol,
      side,
      sl,
      tp,
      leverage,
      price: lastPrice,
    }
  }

  private getIndicatorValue(
    indicators: IndicatorCreate[],
    name: string,
    period: number,
  ): number {
    return (
      indicators.find(
        (i: IndicatorCreate) => i.name === name && i.period === period,
      )?.value ?? 0
    )
  }
}
