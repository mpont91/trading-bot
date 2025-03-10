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

export interface IndicatorRepository {
  createSMA(indicator: IndicatorSMACreate): Promise<void>
  getSMA(symbol: string): Promise<IndicatorSMA | null>
  createRSI(indicator: IndicatorRSICreate): Promise<void>
  getRSI(symbol: string): Promise<IndicatorRSI | null>
  createATR(indicator: IndicatorATRCreate): Promise<void>
  getATR(symbol: string): Promise<IndicatorATR | null>
  createADX(indicator: IndicatorADXCreate): Promise<void>
  getADX(symbol: string): Promise<IndicatorADX | null>
  createBB(indicator: IndicatorBBCreate): Promise<void>
  getBB(symbol: string): Promise<IndicatorBB | null>
}
