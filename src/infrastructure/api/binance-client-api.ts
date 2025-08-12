import {
  Interval,
  OrderType,
  RestMarketTypes,
  RestTradeTypes,
} from '@binance/connector-typescript'
import { Api } from '../../application/api'
import { Kline, KlineInterval } from '../../domain/types/kline'
import {
  mapBinanceToDomainKline,
  mapDomainToBinanceKlineInterval,
} from './mappers/kline-mapper'
import { Balance } from '../../domain/types/balance'
import { Symbol } from '../../domain/types/symbol'
import { mapBinanceToDomainSymbol } from './mappers/symbol-mapper'
import { CommissionEquityCreate } from '../../domain/models/commission-equity'
import { getEmptyCommissionEquityCreate } from '../../domain/helpers/commission-helper'
import { mapDomainToBinanceSide } from './mappers/side-mapper'
import { OrderCreate, OrderRequest } from '../../domain/models/order'
import { mapBinanceToDomainOrder } from './mappers/order-mapper'
import { Position } from '../../domain/types/position'
import { mapBinanceToDomainPosition } from './mappers/position-mapper'
import { BinanceSettings } from '../../domain/types/settings'
import { BinanceSpotApi } from './binance-spot-api'

export class BinanceClientApi implements Api {
  constructor(
    private readonly api: BinanceSpotApi,
    private readonly settings: BinanceSettings,
  ) {}

  async getBalance(): Promise<Balance> {
    const balances: RestTradeTypes.accountInformationBalances[] = (
      await this.api.accountInformation()
    ).balances

    let equity: number = 0
    let available: number = 0

    for (const balance of balances) {
      if (balance.asset === this.settings.feeCurrency) {
        continue
      }

      const quantity: number = parseFloat(balance.free)

      if (balance.asset === this.settings.baseCurrency) {
        equity += quantity
        available += quantity
        continue
      }

      const price: number = await this.getPrice(
        balance.asset + this.settings.baseCurrency,
      )
      equity += parseFloat(balance.free) * price
    }

    return {
      equity: equity,
      available: available,
    }
  }

  async getCommissionEquity(): Promise<CommissionEquityCreate> {
    const balances: RestTradeTypes.accountInformationBalances[] = (
      await this.api.accountInformation()
    ).balances

    const balance: RestTradeTypes.accountInformationBalances | undefined =
      balances.find(
        (balance: RestTradeTypes.accountInformationBalances): boolean =>
          balance.asset === this.settings.feeCurrency,
      )

    if (!balance) {
      return getEmptyCommissionEquityCreate()
    }

    const price: number = await this.getPrice(
      balance.asset + this.settings.baseCurrency,
    )
    const quantity: number = parseFloat(balance.free)
    const amount: number = quantity * price

    return {
      currency: this.settings.feeCurrency,
      quantity: quantity,
      amount: amount,
    }
  }

  async getPrice(symbol: string): Promise<number> {
    const response: RestMarketTypes.symbolPriceTickerResponse =
      (await this.api.symbolPriceTicker(
        symbol,
      )) as RestMarketTypes.symbolPriceTickerResponse
    return parseFloat(response.price)
  }

  async getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]> {
    const options: RestMarketTypes.klineCandlestickDataOptions = {
      startTime: start.getTime(),
      endTime: end.getTime(),
    }
    const binanceKlineInterval: Interval =
      mapDomainToBinanceKlineInterval(interval)
    const response: RestMarketTypes.klineCandlestickDataResponse[] =
      await this.api.klineCandlestickData(symbol, binanceKlineInterval, options)

    return response.map(mapBinanceToDomainKline)
  }

  async getSymbol(symbol: string): Promise<Symbol> {
    const price: number = await this.getPrice(symbol)

    const exchangeInfo: RestMarketTypes.exchangeInformationResponse =
      await this.api.exchangeInformation(symbol)

    return mapBinanceToDomainSymbol(exchangeInfo.symbols[0], price)
  }

  async submitOrder(orderRequest: OrderRequest): Promise<string> {
    const options: RestTradeTypes.newOrderOptions = {
      quantity: orderRequest.quantity,
    }

    const response: RestTradeTypes.newOrderResponse = await this.api.newOrder(
      orderRequest.symbol,
      mapDomainToBinanceSide(orderRequest.side),
      'MARKET' as OrderType,
      options,
    )

    return response.orderId.toString()
  }

  async getOrder(symbol: string, orderId: string): Promise<OrderCreate> {
    const orderResponse: RestTradeTypes.getOrderResponse =
      await this.api.getOrder(symbol, orderId)
    const tradesResponse: RestTradeTypes.accountTradeListResponse[] =
      await this.api.accountTradeList(symbol, orderId)
    const feeCurrencyPrice: number = await this.getPrice(
      this.settings.feeCurrency + this.settings.baseCurrency,
    )

    return mapBinanceToDomainOrder(
      orderResponse,
      tradesResponse,
      feeCurrencyPrice,
    )
  }

  async getPosition(symbol: string): Promise<Position | null> {
    const balances: RestTradeTypes.accountInformationBalances[] = (
      await this.api.accountInformation()
    ).balances

    const currency: string = symbol.replace(
      new RegExp(`${this.settings.baseCurrency}$`),
      '',
    )

    const balance: RestTradeTypes.accountInformationBalances | undefined =
      balances.find(
        (b: RestTradeTypes.accountInformationBalances): boolean =>
          b.asset === currency,
      )

    if (!balance) {
      return null
    }

    const order: RestTradeTypes.allOrdersResponse | null =
      await this.getLastOrder(symbol)

    if (!order) {
      throw new Error(
        'There is amount in currency but no order. Something is broken!',
      )
    }

    if (order.executedQty !== balance.free) {
      throw new Error(
        'The amount in currency does not match with the order quantity. Something is broken!',
      )
    }

    return mapBinanceToDomainPosition(order)
  }

  private async getLastOrder(
    symbol: string,
  ): Promise<RestTradeTypes.allOrdersResponse | null> {
    const options: RestTradeTypes.allOrdersOptions = {
      limit: 1,
    }
    const orders: RestTradeTypes.allOrdersResponse[] = await this.api.allOrders(
      symbol,
      options,
    )

    if (orders.length === 0) {
      return null
    }

    return orders[0]
  }
}
