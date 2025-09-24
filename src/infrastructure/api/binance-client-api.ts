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
import { mapDomainToBinanceSide } from './mappers/side-mapper'
import { OrderCreate, OrderRequest } from '../../domain/models/order'
import { mapBinanceToDomainOrder } from './mappers/order-mapper'
import { BinanceSettings } from '../../domain/types/settings'
import { BinanceSpotApi } from './binance-spot-api'
import { EquityCreate } from '../../domain/models/equity'
import { Coin } from '../../domain/types/coin'

export class BinanceClientApi implements Api {
  constructor(
    private readonly api: BinanceSpotApi,
    private readonly settings: BinanceSettings,
  ) {}

  async getCoins(): Promise<Coin[]> {
    const balances: RestTradeTypes.accountInformationBalances[] = (
      await this.api.accountInformation()
    ).balances

    const coins: Coin[] = []

    for (const balance of balances) {
      coins.push({
        name: balance.asset,
        quantity: parseFloat(balance.free),
      })
    }

    return coins
  }

  async getBalance(): Promise<Balance> {
    const coins: Coin[] = await this.getCoins()

    let equity: number = 0
    let available: number = 0

    for (const coin of coins) {
      if (coin.name === this.settings.feeCurrency) {
        continue
      }

      if (coin.name === this.settings.baseCurrency) {
        equity += coin.quantity
        available += coin.quantity
        continue
      }

      const price: number = await this.getPrice(
        coin.name + this.settings.baseCurrency,
      )
      equity += coin.quantity * price
    }

    return {
      equity: equity,
      available: available,
    }
  }

  async getEquity(): Promise<EquityCreate> {
    const coins: Coin[] = await this.getCoins()

    let equity: number = 0

    for (const coin of coins) {
      if (coin.name === this.settings.feeCurrency) {
        continue
      }

      if (coin.name === this.settings.baseCurrency) {
        equity += coin.quantity
        continue
      }

      const price: number = await this.getPrice(
        coin.name + this.settings.baseCurrency,
      )
      equity += coin.quantity * price
    }

    return {
      amount: equity,
    }
  }

  async getCommissionEquity(): Promise<CommissionEquityCreate> {
    const coins: Coin[] = await this.getCoins()

    const coin: Coin | undefined = coins.find(
      (c: Coin): boolean => c.name === this.settings.feeCurrency,
    )

    if (!coin) {
      return {
        currency: this.settings.feeCurrency,
        quantity: 0,
        amount: 0,
      }
    }

    const price: number = await this.getPrice(
      coin.name + this.settings.baseCurrency,
    )

    const amount: number = coin.quantity * price

    return {
      currency: this.settings.feeCurrency,
      quantity: coin.quantity,
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
      OrderType.MARKET,
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
}
