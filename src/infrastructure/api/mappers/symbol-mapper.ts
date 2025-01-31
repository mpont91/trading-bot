import { RestMarketTypes } from '@binance/connector-typescript'
import { Symbol } from '../../../domain/types/symbol'
import { FuturesContractDetails } from 'bitmart-api'

export function mapBinanceToDomainSymbol(
  binanceSymbol: RestMarketTypes.exchangeInformationSymbols,
): Symbol {
  const lotSize: RestMarketTypes.lotSize = binanceSymbol.filters.find(
    (filter): boolean => filter.filterType === 'LOT_SIZE',
  ) as RestMarketTypes.lotSize

  if (!lotSize) {
    throw new Error(`Lot size filter not found for ${binanceSymbol.symbol}.`)
  }

  console.log(binanceSymbol)

  return {
    name: binanceSymbol.symbol,
    price: 1,
    stepSize: parseFloat(lotSize.stepSize),
    contractSize: 0,
    pricePrecision: 1,
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
    pricePrecision: parseFloat(bitmartSymbol.price_precision),
  }
}
