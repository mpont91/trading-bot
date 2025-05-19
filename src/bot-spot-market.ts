import { Container } from './di'
import { Launcher } from './application/launcher'

export const botSpotMarket = (): void => {
  console.log('Bot spot market running')
  const launcherMarket: Launcher = Container.getLauncherSpotMarket()

  launcherMarket.start().catch((error: unknown): void => {
    console.error('Error in spot bot market', error)
  })
}
