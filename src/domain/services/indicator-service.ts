import { Candle } from '../types/candle'
import { ApiService } from './api-service'
import {
  SmaIndicatorCalculator,
  SmaIndicatorResult,
} from '../indicators/sma-indicator'
import {
  RsiIndicatorCalculator,
  RsiIndicatorResult,
} from '../indicators/rsi-indicator'
import {
  AdxIndicatorCalculator,
  AdxIndicatorResult,
} from '../indicators/adx-indicator'
import {
  AtrIndicatorCalculator,
  AtrIndicatorResult,
} from '../indicators/atr-indicator'
import {
  BbIndicatorCalculator,
  BbIndicatorResult,
} from '../indicators/bb-indicator'

export class IndicatorService {
  constructor(private readonly apiService: ApiService) {}

  sma(symbol: string, candles: Candle[], period: number): SmaIndicatorResult {
    return new SmaIndicatorCalculator(period).calculate(symbol, candles)
  }

  rsi(symbol: string, candles: Candle[], period: number): RsiIndicatorResult {
    return new RsiIndicatorCalculator(period).calculate(symbol, candles)
  }

  adx(symbol: string, candles: Candle[], period: number): AdxIndicatorResult {
    return new AdxIndicatorCalculator(period).calculate(symbol, candles)
  }

  atr(symbol: string, candles: Candle[], period: number): AtrIndicatorResult {
    return new AtrIndicatorCalculator(period).calculate(symbol, candles)
  }

  bb(
    symbol: string,
    candles: Candle[],
    period: number,
    stdDev: number,
  ): BbIndicatorResult {
    return new BbIndicatorCalculator(period, stdDev).calculate(symbol, candles)
  }
}
