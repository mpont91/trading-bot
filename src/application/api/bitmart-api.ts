import { Api } from './api'

export interface BitmartApi extends Api {
  setLeverage(symbol: string, leverage: number): Promise<void>
}
