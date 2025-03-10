import { StrategyCreate } from '../models/strategy'
import { Kline } from '../types/kline'
import { IndicatorService } from './indicator-service'
import {
  IndicatorADXCreate,
  IndicatorATRCreate,
  IndicatorBBCreate,
  IndicatorRSICreate,
  IndicatorSMACreate,
} from '../models/indicator'
import { BbStrategy } from '../strategies/bb-strategy'

export class PredictionService {
  constructor(
    private readonly indicatorService: IndicatorService,
    private readonly bbStrategy: BbStrategy,
  ) {}
  async predict(symbol: string, klines: Kline[]): Promise<StrategyCreate> {
    const sma: IndicatorSMACreate = this.indicatorService.sma(symbol, klines)
    await this.indicatorService.createSMA(sma)

    const rsi: IndicatorRSICreate = this.indicatorService.rsi(symbol, klines)
    await this.indicatorService.createRSI(rsi)

    const atr: IndicatorATRCreate = this.indicatorService.atr(symbol, klines)
    await this.indicatorService.createATR(atr)

    const adx: IndicatorADXCreate = this.indicatorService.adx(symbol, klines)
    await this.indicatorService.createADX(adx)

    const bb: IndicatorBBCreate = this.indicatorService.bb(symbol, klines)
    await this.indicatorService.createBB(bb)

    return this.bbStrategy.createStrategy(bb)
  }
}
