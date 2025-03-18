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
  IndicatorSMACrossCreate,
} from '../models/indicator'
import { IndicatorSMACross } from '@prisma/client'

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
  createSMACross(indicator: IndicatorSMACrossCreate): Promise<void>
  getSMACross(symbol: string): Promise<IndicatorSMACross | null>
}
