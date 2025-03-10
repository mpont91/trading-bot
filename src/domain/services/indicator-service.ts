import { SmaIndicator } from '../indicators/sma-indicator'
import { RsiIndicator } from '../indicators/rsi-indicator'
import { AtrIndicator } from '../indicators/atr-indicator'
import { Kline } from '../types/kline'
import { AdxIndicator } from '../indicators/adx-indicator'
import { BbIndicator } from '../indicators/bb-indicator'
import { IndicatorRepository } from '../repositories/indicator-repository'
import {
  IndicatorADX,
  IndicatorATR,
  IndicatorBB,
  IndicatorRSI,
  IndicatorSMA,
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

  calculateSMA(symbol: string, klines: Kline[]): IndicatorSMACreate {
    return this.smaIndicator.calculate(symbol, klines)
  }

  async createSMA(indicator: IndicatorSMACreate): Promise<void> {
    await this.indicatorRepository.createSMA(indicator)
  }

  async getSMA(symbol: string): Promise<IndicatorSMA | null> {
    return this.indicatorRepository.getSMA(symbol)
  }

  calculateRSI(symbol: string, klines: Kline[]): IndicatorRSICreate {
    return this.rsiIndicator.calculate(symbol, klines)
  }

  async createRSI(indicator: IndicatorRSICreate): Promise<void> {
    await this.indicatorRepository.createRSI(indicator)
  }

  async getRSI(symbol: string): Promise<IndicatorRSI | null> {
    return this.indicatorRepository.getRSI(symbol)
  }

  calculateATR(symbol: string, klines: Kline[]): IndicatorATRCreate {
    return this.atrIndicator.calculate(symbol, klines)
  }

  async createATR(indicator: IndicatorATRCreate): Promise<void> {
    await this.indicatorRepository.createATR(indicator)
  }

  async getATR(symbol: string): Promise<IndicatorATR | null> {
    return this.indicatorRepository.getATR(symbol)
  }

  calculateADX(symbol: string, klines: Kline[]): IndicatorADXCreate {
    return this.adxIndicator.calculate(symbol, klines)
  }

  async createADX(indicator: IndicatorADXCreate): Promise<void> {
    await this.indicatorRepository.createADX(indicator)
  }

  async getADX(symbol: string): Promise<IndicatorADX | null> {
    return this.indicatorRepository.getADX(symbol)
  }

  calculateBB(symbol: string, klines: Kline[]): IndicatorBBCreate {
    return this.bbIndicator.calculate(symbol, klines)
  }

  async createBB(indicator: IndicatorBBCreate): Promise<void> {
    await this.indicatorRepository.createBB(indicator)
  }
  async getBB(symbol: string): Promise<IndicatorBB | null> {
    return this.indicatorRepository.getBB(symbol)
  }

  async calculateAndCreateAll(symbol: string, klines: Kline[]): Promise<void> {
    const sma: IndicatorSMACreate = this.calculateSMA(symbol, klines)
    await this.createSMA(sma)

    const rsi: IndicatorRSICreate = this.calculateRSI(symbol, klines)
    await this.createRSI(rsi)

    const atr: IndicatorATRCreate = this.calculateATR(symbol, klines)
    await this.createATR(atr)

    const adx: IndicatorADXCreate = this.calculateADX(symbol, klines)
    await this.createADX(adx)

    const bb: IndicatorBBCreate = this.calculateBB(symbol, klines)
    await this.createBB(bb)
  }
}
