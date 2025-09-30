interface Indicator {
  id: number
  symbol: string
  price: number
  createdAt: Date
}

export interface IndicatorSMA extends Indicator {
  period: number
  sma: number
}

export type IndicatorSMACreate = Omit<IndicatorSMA, 'id' | 'createdAt'>

export interface IndicatorRSI extends Indicator {
  period: number
  rsi: number
}

export type IndicatorRSICreate = Omit<IndicatorRSI, 'id' | 'createdAt'>

export interface IndicatorATR extends Indicator {
  period: number
  atr: number
}

export type IndicatorATRCreate = Omit<IndicatorATR, 'id' | 'createdAt'>

export interface IndicatorADX extends Indicator {
  period: number
  adx: number
  pdi: number
  mdi: number
}

export type IndicatorADXCreate = Omit<IndicatorADX, 'id' | 'createdAt'>

export interface IndicatorBB extends Indicator {
  period: number
  upper: number
  middle: number
  lower: number
  pb: number
}

export type IndicatorBBCreate = Omit<IndicatorBB, 'id' | 'createdAt'>

export interface IndicatorSMACross extends Indicator {
  periodLong: number
  periodShort: number
  smaLong: number
  smaShort: number
}

export type IndicatorSMACrossCreate = Omit<
  IndicatorSMACross,
  'id' | 'createdAt'
>

export interface IndicatorList {
  sma: IndicatorSMA
  rsi: IndicatorRSI
  atr: IndicatorATR
  adx: IndicatorADX
  bb: IndicatorBB
  smaCross: IndicatorSMACross
}

export interface IndicatorListCreate {
  sma: IndicatorSMACreate
  rsi: IndicatorRSICreate
  atr: IndicatorATRCreate
  adx: IndicatorADXCreate
  bb: IndicatorBBCreate
  smaCross: IndicatorSMACrossCreate
}

export enum IndicatorName {
  SMA = 'sma',
  RSI = 'rsi',
  ATR = 'atr',
  ADX = 'adx',
  BB = 'bb',
  SMACROSS = 'smacross',
}

export function indicatorNameRule(
  value: string,
): asserts value is IndicatorName {
  const options: IndicatorName[] = Object.values(IndicatorName)
  if (!options.includes(value as IndicatorName)) {
    throw new Error(
      `Indicator name parameter must be one of the following: [${options.join(', ')}]`,
    )
  }
}
