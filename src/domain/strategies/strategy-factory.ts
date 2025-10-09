import { Strategy } from './strategy'
import { MeanReversionStrategy } from './mean-reversion-strategy'
import { SlowSwingStrategy } from './slow-swing-strategy'
import { Settings } from '../types/settings'

export function createStrategy(settings: Settings): Strategy {
  const strategyName: string = settings.strategy || 'mean-reversion'

  switch (strategyName) {
    case 'mean-reversion':
      return new MeanReversionStrategy(settings.strategies.meanReversion)
    case 'slow-swing':
      return new SlowSwingStrategy(settings.strategies.slowSwing)
    default:
      throw new Error(
        `[StrategyFactory] Unknown strategy name: '${strategyName}'`,
      )
  }
}
