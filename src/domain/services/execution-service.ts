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
    const position: Position | null = await this.positionService.get(symbol)

    if (position) {
      if (strategy?.signal === Signal.SELL) {
        await this.tradeService.closeTrade(position)
        return
      }
      await this.tradeService.handleTrade(position)
    } else {
      if (
        strategy?.signal === Signal.BUY &&
        (await this.tradeService.canOpenNewTrade())
      ) {
        await this.tradeService.openTrade(strategy)
        return
      }
    }
  }
}
