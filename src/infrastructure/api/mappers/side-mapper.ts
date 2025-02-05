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

export function mapBitmartToDomainSide(bitmartSide: 1 | 2 | 3 | 4): Side {
  switch (bitmartSide) {
    case 1:
    case 2:
      return 'long'
    case 3:
    case 4:
      return 'short'
    default:
      throw new Error('Invalid side: ' + bitmartSide)
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

export function mapBinanceToDomainSide(binanceSide: BinanceSide): Side {
  switch (binanceSide) {
    case <BinanceSide>'BUY':
      return 'long'
    case <BinanceSide>'SELL':
      return 'short'
    default:
      throw new Error('Invalid side: ' + binanceSide)
  }
}
