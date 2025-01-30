import { Container } from './di'
import { Launcher } from './application/launcher'

export const botSpot = (): void => {
  console.log('Bot spot running')
  const launcherSpot: Launcher = Container.getLauncherSpot()

  launcherSpot.start().catch((error: unknown): void => {
    console.error('Error in bot spot:', error)
  })
}
