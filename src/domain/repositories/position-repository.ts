import { Position } from '../models/position'

export interface PositionRepository {
  create(position: Position): Promise<void>
  get(symbol: string): Promise<Position | null>
  remove(symbol: string): Promise<void>
  list(): Promise<Position[]>
}
