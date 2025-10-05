import { StrategyActionService } from './strategy-action-service'
import { TradeService } from './trade-service'
import { PositionService } from './position-service'
import { StrategyAction } from '../models/strategy-action'
import { Signal } from '../types/signal'
import { Position } from '../models/position'

export class ExecutionService {
  constructor(
    private readonly positionService: PositionService,
    private readonly strategyService: StrategyActionService,
    private readonly tradeService: TradeService,
  ) {}

  async execute(symbol: string): Promise<void> {
    const strategy: StrategyAction | null =
      await this.strategyService.last(symbol)
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
