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
  IndicatorSMACross,
  IndicatorADXCreate,
  IndicatorATRCreate,
  IndicatorBBCreate,
  IndicatorRSICreate,
  IndicatorSMACreate,
  IndicatorSMACrossCreate,
} from '../models/indicator'
import { SmaCrossIndicator } from '../indicators/sma-cross-indicator'
import { ApiService } from './api-service'

export class IndicatorService {
  constructor(
    private readonly apiService: ApiService,
    private readonly indicatorRepository: IndicatorRepository,
    private readonly smaIndicator: SmaIndicator,
    private readonly rsiIndicator: RsiIndicator,
    private readonly adxIndicator: AdxIndicator,
    private readonly atrIndicator: AtrIndicator,
    private readonly bbIndicator: BbIndicator,
    private readonly smaCrossIndicator: SmaCrossIndicator,
  ) {}

  async storeSMA(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    const indicator: IndicatorSMACreate = this.smaIndicator.calculate(
      symbol,
      klines,
    )
    await this.indicatorRepository.createSMA(indicator)
  }

  async getSMA(symbol: string): Promise<IndicatorSMA | null> {
    return this.indicatorRepository.getSMA(symbol)
  }

  async storeRSI(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    const indicator: IndicatorRSICreate = this.rsiIndicator.calculate(
      symbol,
      klines,
    )
    await this.indicatorRepository.createRSI(indicator)
  }

  async getRSI(symbol: string): Promise<IndicatorRSI | null> {
    return this.indicatorRepository.getRSI(symbol)
  }

  async storeATR(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    const indicator: IndicatorATRCreate = this.atrIndicator.calculate(
      symbol,
      klines,
    )
    await this.indicatorRepository.createATR(indicator)
  }

  async getATR(symbol: string): Promise<IndicatorATR | null> {
    return this.indicatorRepository.getATR(symbol)
  }

  async storeADX(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    const indicator: IndicatorADXCreate = this.adxIndicator.calculate(
      symbol,
      klines,
    )
    await this.indicatorRepository.createADX(indicator)
  }

  async getADX(symbol: string): Promise<IndicatorADX | null> {
    return this.indicatorRepository.getADX(symbol)
  }

  async storeBB(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    const indicator: IndicatorBBCreate = this.bbIndicator.calculate(
      symbol,
      klines,
    )
    await this.indicatorRepository.createBB(indicator)
  }
  async getBB(symbol: string): Promise<IndicatorBB | null> {
    return this.indicatorRepository.getBB(symbol)
  }

  async storeSMACross(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    const indicator: IndicatorSMACrossCreate = this.smaCrossIndicator.calculate(
      symbol,
      klines,
    )
    await this.indicatorRepository.createSMACross(indicator)
  }
  async getSMACross(symbol: string): Promise<IndicatorSMACross | null> {
    return this.indicatorRepository.getSMACross(symbol)
  }

  async storeAll(symbol: string): Promise<void> {
    await this.storeSMA(symbol)
    await this.storeRSI(symbol)
    await this.storeATR(symbol)
    await this.storeADX(symbol)
    await this.storeBB(symbol)
    await this.storeSMACross(symbol)
  }
}
