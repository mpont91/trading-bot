import { SmaIndicator } from '../indicators/sma-indicator'
import { RsiIndicator } from '../indicators/rsi-indicator'
import { AdxIndicator, AdxIndicatorType } from '../indicators/adx-indicator'
import { AtrIndicator } from '../indicators/atr-indicator'
import { BbIndicator, BbIndicatorType } from '../indicators/bb-indicator'
import { Kline } from '../types/kline'

export class IndicatorService {
  constructor(
    private readonly smaIndicator: SmaIndicator,
    private readonly rsiIndicator: RsiIndicator,
    private readonly adxIndicator: AdxIndicator,
    private readonly atrIndicator: AtrIndicator,
    private readonly bbIndicator: BbIndicator,
  ) {}

  sma(klines: Kline[]): number {
    return this.smaIndicator.calculate(klines)
  }

  rsi(klines: Kline[]): number {
    return this.rsiIndicator.calculate(klines)
  }

  atr(klines: Kline[]): number {
    return this.atrIndicator.calculate(klines)
  }

  adx(klines: Kline[]): AdxIndicatorType {
    return this.adxIndicator.calculate(klines)
  }

  bb(klines: Kline[]): BbIndicatorType {
    return this.bbIndicator.calculate(klines)
  }
}
