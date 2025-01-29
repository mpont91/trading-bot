import { Kline, KlineInterval } from '../../../domain/types/kline'
import { Interval } from '@binance/connector-typescript'

export function mapBinanceKline(apiKline: (string | number)[]): Kline {
  return {
    time: new Date(<number>apiKline[0]),
    openPrice: parseFloat(<string>apiKline[1]),
    highPrice: parseFloat(<string>apiKline[2]),
    lowPrice: parseFloat(<string>apiKline[3]),
    closePrice: parseFloat(<string>apiKline[4]),
    volume: parseFloat(<string>apiKline[5]),
  }
}

export function domainMapBinanceKlineInterval(
  klineInterval: KlineInterval,
): Interval {
  return <Interval>'5m'
}
