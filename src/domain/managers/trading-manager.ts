import { ManagerInterface } from './manager-interface'
import { StrategyService } from '../services/strategy-service'
import { PositionService } from '../services/position-service'
import { Strategy } from '../models/strategy'
import { Position } from '../types/position'
import { TradingMode } from '../types/trading-mode'
import { TrailingService } from '../services/trailing-service'
import { Trailing, TrailingCreate } from '../models/trailing'
import { isSL, isTP } from '../helpers/stops-helper'

export class TradingManager implements ManagerInterface {
  constructor(
    private readonly tradingMode: TradingMode,
    private readonly symbols: string[],
    private readonly positionService: PositionService,
    private readonly strategyService: StrategyService,
    private readonly trailingService: TrailingService,
  ) {}

  async start(): Promise<void> {
    for (const symbol of this.symbols) {
      const strategy: Strategy =
        await this.strategyService.getLastForSymbol(symbol)

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

      await this.handlePosition(position, strategy.price)
    }
  }

  async handlePosition(position: Position, price: number): Promise<void> {
    const trailing: Trailing | null = await this.trailingService.get(
      position.symbol,
    )

    if (
      !trailing ||
      isTP(trailing.side, price, trailing.tp) ||
      isSL(trailing.side, price, trailing.sl)
    ) {
      await this.positionService.closePosition(position.symbol)
      return
    }
  }
  async handleOpportunity(strategy: Strategy): Promise<void> {
    if (
      (this.tradingMode === 'spot' && strategy.side === 'long') ||
      (this.tradingMode === 'futures' && strategy.side !== 'hold')
    ) {
      await this.positionService.openPosition(strategy.symbol, strategy.side)
      const trailing: TrailingCreate = {
        symbol: strategy.symbol,
        side: strategy.side,
        tp: strategy.tp,
        sl: strategy.sl,
      }
      await this.trailingService.create(trailing)
    }
  }
}
