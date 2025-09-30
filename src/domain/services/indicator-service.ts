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
  IndicatorListCreate,
} from '../models/indicator'
import { SmaCrossIndicator } from '../indicators/sma-cross-indicator'
import { ApiService } from './api-service'
import { TimeInterval } from '../types/time-interval'
import { reduceRecordsData } from '../helpers/graph-helper'

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

  calculateAll(symbol: string, klines: Kline[]): IndicatorListCreate {
    return {
      sma: this.smaIndicator.calculate(symbol, klines),
      rsi: this.rsiIndicator.calculate(symbol, klines),
      adx: this.adxIndicator.calculate(symbol, klines),
      atr: this.atrIndicator.calculate(symbol, klines),
      bb: this.bbIndicator.calculate(symbol, klines),
      smaCross: this.smaCrossIndicator.calculate(symbol, klines),
    }
  }

  async storeAll(symbol: string): Promise<void> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    await this.storeSMA(symbol, klines)
    await this.storeRSI(symbol, klines)
    await this.storeATR(symbol, klines)
    await this.storeADX(symbol, klines)
    await this.storeBB(symbol, klines)
    await this.storeSMACross(symbol, klines)
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

  async getGraphSMA(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorSMA[]> {
    const sma: IndicatorSMA[] = await this.indicatorRepository.getGraphSMA(
      symbol,
      interval,
    )

    return reduceRecordsData(sma)
  }

  async getGraphRSI(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorRSI[]> {
    const rsi: IndicatorRSI[] = await this.indicatorRepository.getGraphRSI(
      symbol,
      interval,
    )

    return reduceRecordsData(rsi)
  }

  async getGraphADX(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorADX[]> {
    const adx: IndicatorADX[] = await this.indicatorRepository.getGraphADX(
      symbol,
      interval,
    )

    return reduceRecordsData(adx)
  }

  async getGraphATR(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorATR[]> {
    const atr: IndicatorATR[] = await this.indicatorRepository.getGraphATR(
      symbol,
      interval,
    )

    return reduceRecordsData(atr)
  }

  async getGraphBB(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorBB[]> {
    const bb: IndicatorBB[] = await this.indicatorRepository.getGraphBB(
      symbol,
      interval,
    )

    return reduceRecordsData(bb)
  }

  async getGraphSMACross(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorSMACross[]> {
    const smaCross: IndicatorSMACross[] =
      await this.indicatorRepository.getGraphSMACross(symbol, interval)

    return reduceRecordsData(smaCross)
  }

  private async storeSMA(symbol: string, klines: Kline[]): Promise<void> {
    await this.indicatorRepository.createSMA(
      this.smaIndicator.calculate(symbol, klines),
    )
  }
  private async storeRSI(symbol: string, klines: Kline[]): Promise<void> {
    await this.indicatorRepository.createRSI(
      this.rsiIndicator.calculate(symbol, klines),
    )
  }
  private async storeADX(symbol: string, klines: Kline[]): Promise<void> {
    await this.indicatorRepository.createADX(
      this.adxIndicator.calculate(symbol, klines),
    )
  }
  private async storeATR(symbol: string, klines: Kline[]): Promise<void> {
    await this.indicatorRepository.createATR(
      this.atrIndicator.calculate(symbol, klines),
    )
  }
  private async storeBB(symbol: string, klines: Kline[]): Promise<void> {
    await this.indicatorRepository.createBB(
      this.bbIndicator.calculate(symbol, klines),
    )
  }
  private async storeSMACross(symbol: string, klines: Kline[]): Promise<void> {
    await this.indicatorRepository.createSMACross(
      this.smaCrossIndicator.calculate(symbol, klines),
    )
  }

  private async getSMA(symbol: string): Promise<IndicatorSMA | null> {
    return this.indicatorRepository.getSMA(symbol)
  }
  private async getRSI(symbol: string): Promise<IndicatorRSI | null> {
    return this.indicatorRepository.getRSI(symbol)
  }
  private async getATR(symbol: string): Promise<IndicatorATR | null> {
    return this.indicatorRepository.getATR(symbol)
  }
  private async getADX(symbol: string): Promise<IndicatorADX | null> {
    return this.indicatorRepository.getADX(symbol)
  }
  private async getBB(symbol: string): Promise<IndicatorBB | null> {
    return this.indicatorRepository.getBB(symbol)
  }
  private async getSMACross(symbol: string): Promise<IndicatorSMACross | null> {
    return this.indicatorRepository.getSMACross(symbol)
  }
}
