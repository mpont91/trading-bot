import { Balance } from '../../domain/types/balance'

export interface Api {
  getBalance(): Promise<Balance>
  getStepSize(symbol: string): Promise<number>
}
