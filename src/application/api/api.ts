import { Balance } from '../../domain/types/balance'
import { Symbol } from '../../domain/types/symbol'

export interface Api {
  getBalance(): Promise<Balance>
  getSymbol(symbol: string): Promise<Symbol>
}
