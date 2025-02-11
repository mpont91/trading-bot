import { Strategy } from '../models/strategy'

export function getEmptyStrategy(symbol: string): Strategy {
  return {
    id: 1,
    symbol,
    side: 'hold',
    price: 0,
    createdAt: new Date(),
  }
}
