import { Side } from './side'

export interface OrderRequest {
  symbol: string
  side: Side
  quantity: number
  leverage: number
  isClosePosition?: boolean
}
