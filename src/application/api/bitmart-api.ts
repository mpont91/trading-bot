import { Balance } from '../../domain/types/balance'

export interface BitmartApi {
  getBalance(): Promise<Balance>
}
