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
  IndicatorList,
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
    await this.indicatorRepository.createSMA(
      this.smaIndicator.calculate(symbol, klines),
    )
  }

  async getSMA(symbol: string): Promise<IndicatorSMA | null> {
    return this.indicatorRepository.getSMA(symbol)
  }

  async storeRSI(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    await this.indicatorRepository.createRSI(
      this.rsiIndicator.calculate(symbol, klines),
    )
  }

  async getRSI(symbol: string): Promise<IndicatorRSI | null> {
    return this.indicatorRepository.getRSI(symbol)
  }

  async storeATR(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    await this.indicatorRepository.createATR(
      this.atrIndicator.calculate(symbol, klines),
    )
  }

  async getATR(symbol: string): Promise<IndicatorATR | null> {
    return this.indicatorRepository.getATR(symbol)
  }

  async storeADX(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    await this.indicatorRepository.createADX(
      this.adxIndicator.calculate(symbol, klines),
    )
  }

  async getADX(symbol: string): Promise<IndicatorADX | null> {
    return this.indicatorRepository.getADX(symbol)
  }

  async storeBB(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    await this.indicatorRepository.createBB(
      this.bbIndicator.calculate(symbol, klines),
    )
  }
  async getBB(symbol: string): Promise<IndicatorBB | null> {
    return this.indicatorRepository.getBB(symbol)
  }

  async storeSMACross(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    await this.indicatorRepository.createSMACross(
      this.smaCrossIndicator.calculate(symbol, klines),
    )
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

  async getAll(symbol: string): Promise<IndicatorList | null> {
    const atr: IndicatorATR | null = await this.getATR(symbol)
    const adx: IndicatorADX | null = await this.getADX(symbol)
    const sma: IndicatorSMA | null = await this.getSMA(symbol)
    const rsi: IndicatorRSI | null = await this.getRSI(symbol)
    const bb: IndicatorBB | null = await this.getBB(symbol)
    const smaCross: IndicatorSMACross | null = await this.getSMACross(symbol)

    if (!bb || !sma || !rsi || !atr || !adx || !smaCross) {
      return null
    }

    return {
      atr,
      adx,
      sma,
      rsi,
      bb,
      smaCross,
    }
  }
}
