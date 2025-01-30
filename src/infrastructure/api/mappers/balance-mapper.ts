import { Balance } from '../../../domain/types/balance'
import { FuturesAccountAsset } from 'bitmart-api/dist/mjs/types/response/futures.types'

export function mapBitmartToDomainBalance(
  bitmartFuturesAccountAsset: FuturesAccountAsset,
): Balance {
  return {
    equity: parseFloat(bitmartFuturesAccountAsset.equity),
    available: parseFloat(bitmartFuturesAccountAsset.available_balance),
  }
}
