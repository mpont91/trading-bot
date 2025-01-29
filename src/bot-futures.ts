import { Container } from './di'
import { LauncherFutures } from './application/launcher-futures'

export const botFutures = (): void => {
  console.log('Bot futures running')
  const launcherFutures: LauncherFutures = Container.getLauncherFutures()

  launcherFutures.start().catch((error: unknown): void => {
    console.error('Error in bot futures:', error)
  })
}
