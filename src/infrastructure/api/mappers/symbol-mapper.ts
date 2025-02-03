import { RestMarketTypes } from '@binance/connector-typescript'
import { Symbol } from '../../../domain/types/symbol'
import { FuturesContractDetails } from 'bitmart-api'

export function mapBinanceToDomainSymbol(
  binanceSymbol: RestMarketTypes.exchangeInformationSymbols,
  price: number,
): Symbol {
  const lotSize: RestMarketTypes.lotSize = binanceSymbol.filters.find(
    (filter): boolean => filter.filterType === 'LOT_SIZE',
  ) as RestMarketTypes.lotSize

  if (!lotSize) {
    throw new Error(`Lot size filter not found for ${binanceSymbol.symbol}.`)
  }

  return {
    name: binanceSymbol.symbol,
    price: price,
    stepSize: parseFloat(lotSize.stepSize),
    contractSize: 1,
  }
}

export function mapBitmartToDomainSymbol(
  bitmartSymbol: FuturesContractDetails,
): Symbol {
  return {
    name: bitmartSymbol.symbol,
    price: parseFloat(bitmartSymbol.last_price),
    stepSize: parseFloat(bitmartSymbol.vol_precision),
    contractSize: parseFloat(bitmartSymbol.contract_size),
  }
}
