import { Kline, TimeFrame } from '../../../domain/types/kline'
import { Interval, RestMarketTypes } from '@binance/connector-typescript'

export function mapBinanceToDomainKline(
  kline: RestMarketTypes.klineCandlestickDataResponse,
): Kline {
  return {
    time: new Date(kline[0]),
    openPrice: parseFloat(kline[1] as string),
    highPrice: parseFloat(kline[2] as string),
    lowPrice: parseFloat(kline[3] as string),
    closePrice: parseFloat(kline[4] as string),
    volume: parseFloat(kline[5] as string),
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
