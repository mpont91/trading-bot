import { SmaIndicator } from '../indicators/sma-indicator'
import { RsiIndicator } from '../indicators/rsi-indicator'
import { AdxIndicatorType, BbIndicatorType } from '../models/indicator'
import { AtrIndicator } from '../indicators/atr-indicator'
import { Kline } from '../types/kline'
import { AdxIndicator } from '../indicators/adx-indicator'
import { BbIndicator } from '../indicators/bb-indicator'
import { IndicatorRepository } from '../repositories/indicator-repository'

export class IndicatorService {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
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
