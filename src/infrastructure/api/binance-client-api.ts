import {
  Interval,
  OrderType,
  RestMarketTypes,
  RestTradeTypes,
  Spot,
} from '@binance/connector-typescript'
import { BinanceApi } from '../../application/api/binance-api'
import { BinanceSettings } from '../../application/settings'
import Bottleneck from 'bottleneck'
import { executeWithRateLimit } from './helpers/execute-with-rate-limit'
import { Kline, KlineInterval } from '../../domain/types/kline'
import {
  mapBinanceToDomainKline,
  mapDomainToBinanceKlineInterval,
} from './mappers/kline-mapper'
import { Balance } from '../../domain/types/balance'
import { Symbol } from '../../domain/types/symbol'
import { mapBinanceToDomainSymbol } from './mappers/symbol-mapper'
import { CommissionEquityCreate } from '../../domain/models/commission-equity'
import { getEmptyCommissionEquityCreate } from '../../domain/helpers/commission-spot-helper'
import { mapDomainToBinanceSide } from './mappers/side-mapper'
import { OrderSpotCreate, OrderSpotRequest } from '../../domain/models/order'
import { mapBinanceToDomainOrder } from './mappers/order-mapper'
import { PositionSpot } from '../../domain/types/position'
import { mapBinanceToDomainPosition } from './mappers/position-mapper'

export class BinanceClientApi implements BinanceApi {
  private readonly client: Spot
  private readonly limiter: Bottleneck

  constructor(private readonly settings: BinanceSettings) {
    this.client = new Spot(
      this.settings.binanceApiKey,
      this.settings.binanceApiSecret,
    )
    this.limiter = new Bottleneck({
      maxConcurrent: this.settings.bottleneckMaxConcurrent,
      minTime: this.settings.bottleneckMinTime,
    })
  }

  async getBalance(): Promise<Balance> {
    const balances: RestTradeTypes.accountInformationBalances[] =
      await this.getBinanceBalance()

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
    const balances: RestTradeTypes.accountInformationBalances[] =
      await this.getBinanceBalance()

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
    const task = async (): Promise<number> => {
      const params: RestMarketTypes.symbolPriceTickerOptions = {
        symbol: symbol,
      }
      const response: RestMarketTypes.symbolPriceTickerResponse =
        (await this.client.symbolPriceTicker(
          params,
        )) as RestMarketTypes.symbolPriceTickerResponse

      return parseFloat(response.price)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]> {
    const task = async (): Promise<Kline[]> => {
      const options: RestMarketTypes.klineCandlestickDataOptions = {
        startTime: start.getTime(),
        endTime: end.getTime(),
      }
      const binanceKlineInterval: Interval =
        mapDomainToBinanceKlineInterval(interval)
      const response: RestMarketTypes.klineCandlestickDataResponse[] =
        await this.client.klineCandlestickData(
          symbol,
          binanceKlineInterval,
          options,
        )

      return response.map(mapBinanceToDomainKline)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getSymbol(symbol: string): Promise<Symbol> {
    const task = async (): Promise<Symbol> => {
      const params: RestMarketTypes.exchangeInformationOptions = {
        symbol: symbol,
      }
      const exchangeInfo: RestMarketTypes.exchangeInformationResponse =
        await this.client.exchangeInformation(params)

      const price: number = await this.getPrice(symbol)
      return mapBinanceToDomainSymbol(exchangeInfo.symbols[0], price)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async submitOrder(orderRequest: OrderSpotRequest): Promise<string> {
    const task = async (): Promise<string> => {
      const options: RestTradeTypes.newOrderOptions = {
        quantity: orderRequest.quantity,
      }

      const response: RestTradeTypes.newOrderResponse =
        await this.client.newOrder(
          orderRequest.symbol,
          mapDomainToBinanceSide(orderRequest.side),
          'MARKET' as OrderType,
          options,
        )

      return response.orderId.toString()
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getOrder(symbol: string, orderId: string): Promise<OrderSpotCreate> {
    const orderResponse: RestTradeTypes.getOrderResponse =
      await this.getBinanceOrder(symbol, orderId)
    const tradesResponse: RestTradeTypes.accountTradeListResponse[] =
      await this.getBinanceTrades(symbol, orderId)
    const feeCurrencyPrice: number = await this.getPrice(
      this.settings.feeCurrency + this.settings.baseCurrency,
    )

    return mapBinanceToDomainOrder(
      orderResponse,
      tradesResponse,
      feeCurrencyPrice,
    )
  }

  async getPosition(symbol: string): Promise<PositionSpot | null> {
    const balances: RestTradeTypes.accountInformationBalances[] =
      await this.getBinanceBalance()

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
      await this.getBinanceLastOrder(symbol)

    if (!order) {
      throw Error(
        'There is amount in currency but no order. Something is broken!',
      )
    }

    if (order.executedQty !== balance.free) {
      throw Error(
        'The amount in currency does not match with the order quantity. Something is broken!',
      )
    }

    return mapBinanceToDomainPosition(order)
  }

  private async getBinanceOrder(
    symbol: string,
    orderId: string,
  ): Promise<RestTradeTypes.getOrderResponse> {
    const task = async (): Promise<RestTradeTypes.getOrderResponse> => {
      const options: RestTradeTypes.getOrderOptions = {
        orderId: parseInt(orderId),
      }
      return await this.client.getOrder(symbol, options)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  private async getBinanceTrades(
    symbol: string,
    orderId: string,
  ): Promise<RestTradeTypes.accountTradeListResponse[]> {
    const task = async (): Promise<
      RestTradeTypes.accountTradeListResponse[]
    > => {
      const options: RestTradeTypes.accountTradeListOptions = {
        orderId: parseInt(orderId),
      }
      return await this.client.accountTradeList(symbol, options)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  private async getBinanceBalance(): Promise<
    RestTradeTypes.accountInformationBalances[]
  > {
    const task = async (): Promise<
      RestTradeTypes.accountInformationBalances[]
    > => {
      const params: RestTradeTypes.accountInformationOptions = {
        omitZeroBalances: true,
      }
      const response: RestTradeTypes.accountInformationResponse =
        await this.client.accountInformation(params)

      return response.balances
    }

    return executeWithRateLimit(this.limiter, task)
  }

  private async getBinanceLastOrder(
    symbol: string,
  ): Promise<RestTradeTypes.allOrdersResponse | null> {
    const task = async (): Promise<RestTradeTypes.allOrdersResponse | null> => {
      const options: RestTradeTypes.allOrdersOptions = {
        limit: 1,
      }
      const orders: RestTradeTypes.allOrdersResponse[] =
        await this.client.allOrders(symbol, options)

      if (orders.length === 0) {
        return null
      }

      return orders[0]
    }
    return executeWithRateLimit(this.limiter, task)
  }
}
