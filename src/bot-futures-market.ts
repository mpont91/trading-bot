import { Container } from './di'
import { Launcher } from './application/launcher'

export const botFuturesMarket = (): void => {
  console.log('Bot futures market running')
  const launcherMarket: Launcher = Container.getLauncherFuturesMarket()

  launcherMarket.start().catch((error: unknown): void => {
    console.error('Error in futures bot market', error)
  })
}
