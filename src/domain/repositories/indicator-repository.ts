import {
  IndicatorADXCreate,
  IndicatorATRCreate,
  IndicatorBBCreate,
  IndicatorRSICreate,
  IndicatorSMACreate,
} from '../models/indicator'

export interface IndicatorRepository {
  createSMA(indicator: IndicatorSMACreate): Promise<void>
  createRSI(indicator: IndicatorRSICreate): Promise<void>
  createATR(indicator: IndicatorATRCreate): Promise<void>
  createADX(indicator: IndicatorADXCreate): Promise<void>
  createBB(indicator: IndicatorBBCreate): Promise<void>
}
