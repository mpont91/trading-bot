import { Kline, KlineInterval } from '../../../domain/types/kline'
import { Interval } from '@binance/connector-typescript'

export function mapBinanceToDomainKline(kline: (string | number)[]): Kline {
  return {
    time: new Date(<number>kline[0]),
    openPrice: parseFloat(<string>kline[1]),
    highPrice: parseFloat(<string>kline[2]),
    lowPrice: parseFloat(<string>kline[3]),
    closePrice: parseFloat(<string>kline[4]),
    volume: parseFloat(<string>kline[5]),
  }
}

export function mapDomainToBinanceKlineInterval(
  klineInterval: KlineInterval,
): Interval {
  const mapping: { [key in KlineInterval]: Interval } = {
    1: <Interval>'1m',
    3: <Interval>'3m',
    5: <Interval>'5m',
    15: <Interval>'15m',
    30: <Interval>'30m',
    60: <Interval>'1h',
    120: <Interval>'2h',
    240: <Interval>'4h',
    360: <Interval>'6h',
    720: <Interval>'12h',
    1440: <Interval>'1d',
    4320: <Interval>'3d',
    10080: <Interval>'1w',
  }
  return mapping[klineInterval]
}
