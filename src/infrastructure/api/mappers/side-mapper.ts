import { Side } from '../../../domain/types/side'
import { Side as BinanceSide } from '@binance/connector-typescript'

export function mapDomainToBitmartSide(
  side: Side,
  isClosePosition: boolean = false,
): 1 | 2 | 3 | 4 {
  switch (side) {
    case 'long':
      return isClosePosition ? 2 : 1
    case 'short':
      return isClosePosition ? 3 : 4
    default:
      throw new Error('Invalid side: ' + side)
  }
}

export function mapDomainToBinanceSide(side: Side): BinanceSide {
  switch (side) {
    case 'long':
      return <BinanceSide>'BUY'
    case 'short':
      return <BinanceSide>'SELL'
    default:
      throw new Error('Invalid side: ' + side)
  }
}
