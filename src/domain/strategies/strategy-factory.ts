import { Strategy } from './strategy'
import { SmaCrossSimpleStrategy } from './sma-cross-simple-strategy'
import { Settings } from '../types/settings'

export function createStrategy(settings: Settings): Strategy {
  const strategyName: string = settings.strategy || 'sma-cross-simple'

  switch (strategyName) {
    case 'sma-cross-simple':
      return new SmaCrossSimpleStrategy(settings.strategies.smaCrossSimple)
    default:
      throw new Error(
        `[StrategyFactory] Unknown strategy name: '${strategyName}'`,
      )
  }
}
