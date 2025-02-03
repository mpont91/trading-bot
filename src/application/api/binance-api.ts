import { Kline, KlineInterval } from '../../domain/types/kline'
import { Api } from './api'
import { CommissionEquityCreate } from '../../domain/models/commission-equity'

export interface BinanceApi extends Api {
  getCommissionEquity(): Promise<CommissionEquityCreate>
  getPrice(symbol: string): Promise<number>
  getKline(
    symbol: string,
    interval: KlineInterval,
    start: Date,
    end: Date,
  ): Promise<Kline[]>
}
