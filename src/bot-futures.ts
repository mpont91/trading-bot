import { Container } from './di'
import { Launcher } from './application/launcher'

export const botFutures = (): void => {
  console.log('Bot futures running')
  const launcherFutures: Launcher = Container.getLauncherFutures()

  launcherFutures.start().catch((error: unknown): void => {
    console.error('Error in bot futures:', error)
  })
}
