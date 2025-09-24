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
    case 'BUY' as BinanceSide:
      return Side.LONG
    case 'SELL' as BinanceSide:
      return Side.SHORT
    default:
      throw new Error('Invalid side: ' + binanceSide)
  }
}
