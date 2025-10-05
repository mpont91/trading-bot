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
  const mapping: { [key in TimeFrame]: Interval } = {
    1: '1m' as Interval,
    3: '3m' as Interval,
    5: '5m' as Interval,
    15: '15m' as Interval,
    30: '30m' as Interval,
    60: '1h' as Interval,
    120: '2h' as Interval,
    240: '4h' as Interval,
    360: '6h' as Interval,
    720: '12h' as Interval,
    1440: '1d' as Interval,
    4320: '3d' as Interval,
    10080: '1w' as Interval,
  }
  return mapping[timeFrame]
}
