import { Strategy } from './strategy'
import { SmaCrossSimpleStrategy } from './sma-cross-simple-strategy'
import { Settings } from '../types/settings'
import { DoubleBollingerBandsStrategy } from './double-bollinger-bands-strategy'

export function createStrategy(settings: Settings): Strategy {
  const strategyName: string = settings.strategy || 'sma-cross-simple'

  switch (strategyName) {
    case 'sma-cross-simple':
      return new SmaCrossSimpleStrategy(settings.strategies.smaCrossSimple)
    case 'double-bb':
      return new DoubleBollingerBandsStrategy(settings.strategies.doubleBB)
    default:
      throw new Error(
        `[StrategyFactory] Unknown strategy name: '${strategyName}'`,
      )
  }
}
