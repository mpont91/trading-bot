import { Candle, TimeFrame } from '../../../domain/types/candle'
import { Interval, RestMarketTypes } from '@binance/connector-typescript'

export function mapBinanceToDomainCandle(
  candle: RestMarketTypes.klineCandlestickDataResponse,
): Candle {
  return {
    time: new Date(candle[0]),
    openPrice: parseFloat(candle[1] as string),
    highPrice: parseFloat(candle[2] as string),
    lowPrice: parseFloat(candle[3] as string),
    closePrice: parseFloat(candle[4] as string),
    volume: parseFloat(candle[5] as string),
  }
}

export function mapDomainToBinanceTimeFrame(timeFrame: TimeFrame): Interval {
  const mapping: Record<TimeFrame, Interval> = {
    [TimeFrame['1m']]: Interval['1m'],
    [TimeFrame['3m']]: Interval['3m'],
    [TimeFrame['5m']]: Interval['5m'],
    [TimeFrame['15m']]: Interval['15m'],
    [TimeFrame['30m']]: Interval['30m'],
    [TimeFrame['60m']]: Interval['1h'],
    [TimeFrame['120m']]: Interval['2h'],
    [TimeFrame['240m']]: Interval['4h'],
  }
  return mapping[timeFrame]
}
