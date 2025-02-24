import { SmaIndicator } from '../indicators/sma-indicator'
import { RsiIndicator } from '../indicators/rsi-indicator'
import { AtrIndicator } from '../indicators/atr-indicator'
import { Kline } from '../types/kline'
import { AdxIndicator } from '../indicators/adx-indicator'
import { BbIndicator } from '../indicators/bb-indicator'
import { IndicatorRepository } from '../repositories/indicator-repository'
import {
  IndicatorADXCreate,
  IndicatorATRCreate,
  IndicatorBBCreate,
  IndicatorRSICreate,
  IndicatorSMACreate,
} from '../models/indicator'

export class IndicatorService {
  constructor(
    private readonly indicatorRepository: IndicatorRepository,
    private readonly smaIndicator: SmaIndicator,
    private readonly rsiIndicator: RsiIndicator,
    private readonly adxIndicator: AdxIndicator,
    private readonly atrIndicator: AtrIndicator,
    private readonly bbIndicator: BbIndicator,
  ) {}

  sma(symbol: string, klines: Kline[]): IndicatorSMACreate {
    return this.smaIndicator.calculate(symbol, klines)
  }

  async createSMA(indicator: IndicatorSMACreate): Promise<void> {
    await this.indicatorRepository.createSMA(indicator)
  }

  rsi(symbol: string, klines: Kline[]): IndicatorRSICreate {
    return this.rsiIndicator.calculate(symbol, klines)
  }

  async createRSI(indicator: IndicatorRSICreate): Promise<void> {
    await this.indicatorRepository.createRSI(indicator)
  }

  atr(symbol: string, klines: Kline[]): IndicatorATRCreate {
    return this.atrIndicator.calculate(symbol, klines)
  }

  async createATR(indicator: IndicatorATRCreate): Promise<void> {
    await this.indicatorRepository.createATR(indicator)
  }

  adx(symbol: string, klines: Kline[]): IndicatorADXCreate {
    return this.adxIndicator.calculate(symbol, klines)
  }

  async createADX(indicator: IndicatorADXCreate): Promise<void> {
    await this.indicatorRepository.createADX(indicator)
  }

  bb(symbol: string, klines: Kline[]): IndicatorBBCreate {
    return this.bbIndicator.calculate(symbol, klines)
  }

  async createBB(indicator: IndicatorBBCreate): Promise<void> {
    await this.indicatorRepository.createBB(indicator)
  }
}
