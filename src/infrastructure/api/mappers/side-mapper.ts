import { Side } from '../../../domain/types/side'
import { Side as BinanceSide } from '@binance/connector-typescript'

export function mapDomainToBinanceSide(side: Side): BinanceSide {
  switch (side) {
    case Side.LONG:
      return BinanceSide.BUY
    case Side.SHORT:
      return BinanceSide.SELL
    default:
      throw new Error('Invalid side: ' + side)
  }
}

export function mapBinanceToDomainSide(binanceSide: BinanceSide | ''): Side {
  switch (binanceSide) {
    case BinanceSide.BUY:
      return Side.LONG
    case BinanceSide.SELL:
      return Side.SHORT
    default:
      throw new Error('Invalid side: ' + binanceSide)
  }
}
