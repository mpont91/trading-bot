import { StrategyService } from './strategy-service'
import { TradeService } from './trade-service'
import { PositionService } from './position-service'
import { Strategy } from '../models/strategy'
import { Signal } from '../types/signal'
import { Position } from '../models/position'

export class ExecutionService {
  constructor(
    private readonly positionService: PositionService,
    private readonly strategyService: StrategyService,
    private readonly tradeService: TradeService,
  ) {}

  async execute(symbol: string): Promise<void> {
    const strategy: Strategy | null = await this.strategyService.last(symbol)
    if (!strategy || strategy.signal === Signal.HOLD) {
      return
    }

    const position: Position | null = await this.positionService.get(symbol)

    if (!position && strategy.signal === Signal.BUY) {
      await this.tradeService.openTrade(strategy)
      return
    }

    if (position && strategy.signal === Signal.SELL) {
      await this.tradeService.closeTrade(position)
      return
    }

    if (position) {
      await this.tradeService.handleTrade(position)
      return
    }
  }
}
