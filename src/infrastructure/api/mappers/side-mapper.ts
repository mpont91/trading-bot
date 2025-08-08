import { Side } from '../../../domain/types/side'
import { Side as BinanceSide } from '@binance/connector-typescript'

export function mapDomainToBinanceSide(side: Side): BinanceSide {
  switch (side) {
    case 'long':
      return 'BUY' as BinanceSide
    case 'short':
      return 'SELL' as BinanceSide
    default:
      throw new Error('Invalid side: ' + side)
  }
}

export function mapBinanceToDomainSide(binanceSide: BinanceSide): Side {
  switch (binanceSide) {
    case 'BUY' as BinanceSide:
      return 'long'
    case 'SELL' as BinanceSide:
      return 'short'
    default:
      throw new Error('Invalid side: ' + binanceSide)
  }
}
