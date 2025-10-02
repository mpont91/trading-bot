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
  IndicatorSMACrossCreate,
  IndicatorBBCreate,
  IndicatorSMACreate,
  IndicatorATRCreate,
  IndicatorADXCreate,
  IndicatorRSICreate,
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

  async calculateAndCreateAll(symbol: string): Promise<IndicatorList> {
    const klines: Kline[] = await this.apiService.getKline(symbol)
    return {
      sma: await this.calculateAndCreateSMA(symbol, klines),
      rsi: await this.calculateAndCreateRSI(symbol, klines),
      adx: await this.calculateAndCreateADX(symbol, klines),
      atr: await this.calculateAndCreateATR(symbol, klines),
      bb: await this.calculateAndCreateBB(symbol, klines),
      smaCross: await this.calculateAndCreateSMACross(symbol, klines),
    }
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

  private async calculateAndCreateSMA(
    symbol: string,
    klines: Kline[],
  ): Promise<IndicatorSMA> {
    return this.createSMA(this.smaIndicator.calculate(symbol, klines))
  }
  private async calculateAndCreateRSI(
    symbol: string,
    klines: Kline[],
  ): Promise<IndicatorRSI> {
    return this.createRSI(this.rsiIndicator.calculate(symbol, klines))
  }
  private async calculateAndCreateADX(
    symbol: string,
    klines: Kline[],
  ): Promise<IndicatorADX> {
    return this.createADX(this.adxIndicator.calculate(symbol, klines))
  }
  private async calculateAndCreateATR(
    symbol: string,
    klines: Kline[],
  ): Promise<IndicatorATR> {
    return this.createATR(this.atrIndicator.calculate(symbol, klines))
  }
  private async calculateAndCreateBB(
    symbol: string,
    klines: Kline[],
  ): Promise<IndicatorBB> {
    return this.createBB(this.bbIndicator.calculate(symbol, klines))
  }
  private async calculateAndCreateSMACross(
    symbol: string,
    klines: Kline[],
  ): Promise<IndicatorSMACross> {
    return this.createSMACross(this.smaCrossIndicator.calculate(symbol, klines))
  }

  private async createSMA(sma: IndicatorSMACreate): Promise<IndicatorSMA> {
    return this.indicatorRepository.createSMA(sma)
  }
  private async createRSI(rsi: IndicatorRSICreate): Promise<IndicatorRSI> {
    return this.indicatorRepository.createRSI(rsi)
  }
  private async createATR(atr: IndicatorATRCreate): Promise<IndicatorATR> {
    return this.indicatorRepository.createATR(atr)
  }
  private async createADX(adx: IndicatorADXCreate): Promise<IndicatorADX> {
    return this.indicatorRepository.createADX(adx)
  }
  private async createBB(bb: IndicatorBBCreate): Promise<IndicatorBB> {
    return this.indicatorRepository.createBB(bb)
  }
  private async createSMACross(
    smaCross: IndicatorSMACrossCreate,
  ): Promise<IndicatorSMACross> {
    return this.indicatorRepository.createSMACross(smaCross)
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
