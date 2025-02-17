import { ManagerInterface } from './manager-interface'
import { StrategyService } from '../services/strategy-service'
import { PositionService } from '../services/position-service'
import { Strategy } from '../models/strategy'
import { Position } from '../types/position'
import { TradingMode } from '../types/trading-mode'

export class TradingManager implements ManagerInterface {
  constructor(
    private readonly tradingMode: TradingMode,
    private readonly symbols: string[],
    private readonly positionService: PositionService,
    private readonly strategyService: StrategyService,
  ) {}

  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      const strategy: Strategy =
        await this.strategyService.getLatestForSymbol(symbol)

      if (strategy.side === 'hold') {
        continue
      }

      const position: Position | null =
        await this.positionService.getPosition(symbol)

      if (!position) {
        await this.handleOpportunity(strategy)
        continue
      }

      if (position.side !== strategy.side) {
        await this.positionService.closePosition(symbol)
      }

      await this.handlePosition(position)
    }
  }

  async handlePosition(position: Position): Promise<void> {
    console.log(position)
    //TODO: Logic about closing position if hits TP or SL.
  }
  async handleOpportunity(strategy: Strategy): Promise<void> {
    if (
      (this.tradingMode === 'spot' && strategy.side === 'long') ||
      (this.tradingMode === 'futures' && strategy.side !== 'hold')
    ) {
      await this.positionService.openPosition(strategy.symbol, strategy.side)
    }
  }
}
