import { SmaIndicatorCalculator } from '../indicators/sma-indicator-calculator'
import { RsiIndicatorCalculator } from '../indicators/rsi-indicator-calculator'
import { AtrIndicatorCalculator } from '../indicators/atr-indicator-calculator'
import { Candle, TimeFrame } from '../types/candle'
import { AdxIndicatorCalculator } from '../indicators/adx-indicator-calculator'
import { BbIndicatorCalculator } from '../indicators/bb-indicator-calculator'
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
  IndicatorBBDouble,
  IndicatorBBDoubleCreate,
} from '../models/indicator'
import { SmaCrossIndicatorCalculator } from '../indicators/sma-cross-indicator-calculator'
import { ApiService } from './api-service'
import { TimeInterval } from '../types/time-interval'
import { reduceRecordsData } from '../helpers/graph-helper'
import { BbDoubleIndicatorCalculator } from '../indicators/bb-double-indicator-calculator'

export class IndicatorService {
  constructor(
    private readonly apiService: ApiService,
    private readonly indicatorRepository: IndicatorRepository,
    private readonly smaIndicatorCalculator: SmaIndicatorCalculator,
    private readonly rsiIndicatorCalculator: RsiIndicatorCalculator,
    private readonly adxIndicatorCalculator: AdxIndicatorCalculator,
    private readonly atrIndicatorCalculator: AtrIndicatorCalculator,
    private readonly bbIndicatorCalculator: BbIndicatorCalculator,
    private readonly bbDoubleIndicatorCalculator: BbDoubleIndicatorCalculator,
    private readonly smaCrossIndicatorCalculator: SmaCrossIndicatorCalculator,
  ) {}

  calculateAll(symbol: string, candles: Candle[]): IndicatorListCreate {
    return {
      sma: this.smaIndicatorCalculator.calculate(symbol, candles),
      rsi: this.rsiIndicatorCalculator.calculate(symbol, candles),
      adx: this.adxIndicatorCalculator.calculate(symbol, candles),
      atr: this.atrIndicatorCalculator.calculate(symbol, candles),
      bb: this.bbIndicatorCalculator.calculate(symbol, candles),
      bbDouble: this.bbDoubleIndicatorCalculator.calculate(symbol, candles),
      smaCross: this.smaCrossIndicatorCalculator.calculate(symbol, candles),
    }
  }

  async fetchAndCalculateAndCreateAll(
    symbol: string,
    timeFrame: TimeFrame,
    candlesLimit: number,
  ): Promise<IndicatorList> {
    const candles: Candle[] = await this.apiService.getCandles(
      symbol,
      timeFrame,
      candlesLimit,
    )
    return {
      sma: await this.calculateAndCreateSMA(symbol, candles),
      rsi: await this.calculateAndCreateRSI(symbol, candles),
      adx: await this.calculateAndCreateADX(symbol, candles),
      atr: await this.calculateAndCreateATR(symbol, candles),
      bb: await this.calculateAndCreateBB(symbol, candles),
      bbDouble: await this.calculateAndCreateBBDouble(symbol, candles),
      smaCross: await this.calculateAndCreateSMACross(symbol, candles),
    }
  }

  async getAll(symbol: string): Promise<IndicatorList | null> {
    const atr: IndicatorATR | null = await this.getATR(symbol)
    const adx: IndicatorADX | null = await this.getADX(symbol)
    const sma: IndicatorSMA | null = await this.getSMA(symbol)
    const rsi: IndicatorRSI | null = await this.getRSI(symbol)
    const bb: IndicatorBB | null = await this.getBB(symbol)
    const bbDouble: IndicatorBBDouble | null = await this.getBBDouble(symbol)
    const smaCross: IndicatorSMACross | null = await this.getSMACross(symbol)

    if (!bb || !bbDouble || !sma || !rsi || !atr || !adx || !smaCross) {
      return null
    }

    return {
      atr,
      adx,
      sma,
      rsi,
      bb,
      bbDouble,
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

  async getGraphBBDouble(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorBBDouble[]> {
    const bbDouble: IndicatorBBDouble[] =
      await this.indicatorRepository.getGraphBBDouble(symbol, interval)

    return reduceRecordsData(bbDouble)
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
    candles: Candle[],
  ): Promise<IndicatorSMA> {
    return this.createSMA(
      this.smaIndicatorCalculator.calculate(symbol, candles),
    )
  }
  private async calculateAndCreateRSI(
    symbol: string,
    candles: Candle[],
  ): Promise<IndicatorRSI> {
    return this.createRSI(
      this.rsiIndicatorCalculator.calculate(symbol, candles),
    )
  }
  private async calculateAndCreateADX(
    symbol: string,
    candles: Candle[],
  ): Promise<IndicatorADX> {
    return this.createADX(
      this.adxIndicatorCalculator.calculate(symbol, candles),
    )
  }
  private async calculateAndCreateATR(
    symbol: string,
    candles: Candle[],
  ): Promise<IndicatorATR> {
    return this.createATR(
      this.atrIndicatorCalculator.calculate(symbol, candles),
    )
  }
  private async calculateAndCreateBB(
    symbol: string,
    candles: Candle[],
  ): Promise<IndicatorBB> {
    return this.createBB(this.bbIndicatorCalculator.calculate(symbol, candles))
  }
  private async calculateAndCreateBBDouble(
    symbol: string,
    candles: Candle[],
  ): Promise<IndicatorBBDouble> {
    return this.createBBDouble(
      this.bbDoubleIndicatorCalculator.calculate(symbol, candles),
    )
  }
  private async calculateAndCreateSMACross(
    symbol: string,
    candles: Candle[],
  ): Promise<IndicatorSMACross> {
    return this.createSMACross(
      this.smaCrossIndicatorCalculator.calculate(symbol, candles),
    )
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
  private async createBBDouble(
    bbDouble: IndicatorBBDoubleCreate,
  ): Promise<IndicatorBBDouble> {
    return this.indicatorRepository.createBBDouble(bbDouble)
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
  private async getBBDouble(symbol: string): Promise<IndicatorBBDouble | null> {
    return this.indicatorRepository.getBBDouble(symbol)
  }
  private async getSMACross(symbol: string): Promise<IndicatorSMACross | null> {
    return this.indicatorRepository.getSMACross(symbol)
  }
}
