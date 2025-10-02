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
import { TimeInterval } from '../types/time-interval'

export interface IndicatorRepository {
  createSMA(indicator: IndicatorSMACreate): Promise<IndicatorSMA>
  getSMA(symbol: string): Promise<IndicatorSMA | null>
  createRSI(indicator: IndicatorRSICreate): Promise<IndicatorRSI>
  getRSI(symbol: string): Promise<IndicatorRSI | null>
  createATR(indicator: IndicatorATRCreate): Promise<IndicatorATR>
  getATR(symbol: string): Promise<IndicatorATR | null>
  createADX(indicator: IndicatorADXCreate): Promise<IndicatorADX>
  getADX(symbol: string): Promise<IndicatorADX | null>
  createBB(indicator: IndicatorBBCreate): Promise<IndicatorBB>
  getBB(symbol: string): Promise<IndicatorBB | null>
  createSMACross(indicator: IndicatorSMACrossCreate): Promise<IndicatorSMACross>
  getSMACross(symbol: string): Promise<IndicatorSMACross | null>
  getGraphSMA(symbol: string, interval: TimeInterval): Promise<IndicatorSMA[]>
  getGraphRSI(symbol: string, interval: TimeInterval): Promise<IndicatorRSI[]>
  getGraphADX(symbol: string, interval: TimeInterval): Promise<IndicatorADX[]>
  getGraphATR(symbol: string, interval: TimeInterval): Promise<IndicatorATR[]>
  getGraphBB(symbol: string, interval: TimeInterval): Promise<IndicatorBB[]>
  getGraphSMACross(
    symbol: string,
    interval: TimeInterval,
  ): Promise<IndicatorSMACross[]>
}
