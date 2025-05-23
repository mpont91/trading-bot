import { BitmartApi } from '../../application/api/bitmart-api'
import {
  APIResponse,
  FuturesAccountAsset,
  FuturesAccountOrder,
  FuturesAccountOrderRequest,
  FuturesAccountPosition,
  FuturesClientV2,
  FuturesContractDetails,
  FuturesOrderSubmitResult,
  SetFuturesLeverageRequest,
  SubmitFuturesOrderRequest,
  FuturesAccountTrade,
  FuturesAccountTradesRequest,
  FuturesKlinesRequest,
  FuturesKline,
} from 'bitmart-api'
import Bottleneck from 'bottleneck'
import { Balance } from '../../domain/types/balance'
import { executeWithRateLimit } from './helpers/execute-with-rate-limit'
import { mapBitmartToDomainBalance } from './mappers/balance-mapper'
import { Symbol } from '../../domain/types/symbol'
import { mapBitmartToDomainSymbol } from './mappers/symbol-mapper'
import { mapDomainToBitmartSide } from './mappers/side-mapper'
import {
  OrderFuturesCreate,
  OrderFuturesRequest,
} from '../../domain/models/order'
import { mapBitmartToDomainOrder } from './mappers/order-mapper'
import { PositionFutures } from '../../domain/types/position'
import { mapBitmartToDomainPosition } from './mappers/position-mapper'
import { BitmartSettings } from '../../domain/types/settings'
import { Kline, KlineInterval } from '../../domain/types/kline'
import {
  mapBitmartToDomainKline,
  mapDomainToBitmartKlineInterval,
} from './mappers/kline-mapper'

export class BitmartClientApi implements BitmartApi {
  private readonly client: FuturesClientV2
  private readonly limiter: Bottleneck
  constructor(private readonly settings: BitmartSettings) {
    this.client = new FuturesClientV2({
      apiKey: this.settings.bitmartApiKey,
      apiSecret: this.settings.bitmartApiSecret,
      apiMemo: this.settings.bitmartApiMemo,
    })
    this.limiter = new Bottleneck({
      maxConcurrent: this.settings.bottleneckMaxConcurrent,
      minTime: this.settings.bottleneckMinTime,
    })
  }

  async getBalance(): Promise<Balance> {
    const task = async (): Promise<Balance> => {
      const response: APIResponse<FuturesAccountAsset[]> =
        await this.client.getFuturesAccountAssets()

      this.validateResponse(response)
      return mapBitmartToDomainBalance(response.data[0])
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getPrice(symbol: string): Promise<number> {
    return (await this.getSymbol(symbol)).price
  }

  async getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]> {
    const task = async (): Promise<Kline[]> => {
      const params: FuturesKlinesRequest = {
        symbol: symbol,
        start_time: Math.floor(start.getTime() / 1000),
        end_time: Math.floor(end.getTime() / 1000),
        step: mapDomainToBitmartKlineInterval(interval),
      }
      const response: APIResponse<FuturesKline[]> =
        await this.client.getFuturesKlines(params)

      this.validateResponse(response)

      return response.data.map(mapBitmartToDomainKline)
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getSymbol(symbol: string): Promise<Symbol> {
    const task = async (): Promise<Symbol> => {
      const response: APIResponse<{
        symbols: FuturesContractDetails[]
      }> = await this.client.getFuturesContractDetails({ symbol: symbol })

      this.validateResponse(response)

      return mapBitmartToDomainSymbol(response.data.symbols[0])
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async setLeverage(symbol: string, leverage: number): Promise<void> {
    const task = async (): Promise<void> => {
      const params: SetFuturesLeverageRequest = {
        symbol: symbol,
        leverage: leverage.toString(),
        open_type: 'isolated',
      }

      this.validateResponse(await this.client.setFuturesLeverage(params))
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async submitOrder(orderRequest: OrderFuturesRequest): Promise<string> {
    await this.setLeverage(orderRequest.symbol, orderRequest.leverage)

    const task = async (): Promise<string> => {
      const params: SubmitFuturesOrderRequest = {
        type: 'market',
        open_type: 'isolated',
        symbol: orderRequest.symbol,
        side: mapDomainToBitmartSide(
          orderRequest.side,
          orderRequest.isClosePosition,
        ),
        leverage: orderRequest.leverage.toString(),
        size: orderRequest.quantity,
      }

      const response: APIResponse<FuturesOrderSubmitResult> =
        await this.client.submitFuturesOrder(params)

      this.validateResponse(response)

      return response.data.order_id.toString()
    }

    return executeWithRateLimit(this.limiter, task)
  }

  async getOrder(symbol: string, orderId: string): Promise<OrderFuturesCreate> {
    const symbolInformation: Symbol = await this.getSymbol(symbol)
    const orderResponse: FuturesAccountOrder = await this.getBitmartOrder(
      symbol,
      orderId,
    )

    const orderTime: Date = new Date(orderResponse.create_time)
    const startTime: Date = new Date(orderTime.getTime() - 5 * 60 * 1000)
    const endTime: Date = new Date(orderTime.getTime() + 5 * 60 * 1000)

    const tradesResponse: FuturesAccountTrade[] = await this.getBitmartTrades(
      symbol,
      startTime,
      endTime,
    )

    return mapBitmartToDomainOrder(
      orderResponse,
      tradesResponse,
      symbolInformation,
    )
  }

  async getPosition(symbol: string): Promise<PositionFutures | null> {
    const task = async (): Promise<PositionFutures | null> => {
      const response: APIResponse<FuturesAccountPosition[]> =
        await this.client.getFuturesAccountPositions({ symbol: symbol })

      this.validateResponse(response)

      if (response.data.length === 0) {
        return null
      }

      return mapBitmartToDomainPosition(response.data[0])
    }

    return executeWithRateLimit(this.limiter, task)
  }

  private async getBitmartOrder(
    symbol: string,
    orderId: string,
  ): Promise<FuturesAccountOrder> {
    const task = async (): Promise<FuturesAccountOrder> => {
      const params: FuturesAccountOrderRequest = {
        symbol: symbol,
        order_id: orderId,
      }
      const response: APIResponse<FuturesAccountOrder> =
        await this.client.getFuturesAccountOrder(params)

      this.validateResponse(response)

      return response.data
    }

    return executeWithRateLimit(this.limiter, task)
  }

  private async getBitmartTrades(
    symbol: string,
    startTime: Date,
    endTime: Date,
  ): Promise<FuturesAccountTrade[]> {
    const task = async (): Promise<FuturesAccountTrade[]> => {
      const params: FuturesAccountTradesRequest = {
        symbol: symbol,
        start_time: Math.floor(startTime.getTime() / 1000),
        end_time: Math.floor(endTime.getTime() / 1000),
      }
      const response: APIResponse<FuturesAccountTrade[]> =
        await this.client.getFuturesAccountTrades(params)

      this.validateResponse(response)

      return response.data
    }

    return executeWithRateLimit(this.limiter, task)
  }

  private validateResponse<T>(response: APIResponse<T>): void {
    if (response.code !== 1000) {
      throw new Error(
        `Bitmart API error: ${response.message} (retCode: ${response.code})`,
      )
    }
  }
}
