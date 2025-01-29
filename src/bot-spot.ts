import { Container } from './di'
import { LauncherSpot } from './application/launcher-spot'

export const botSpot = (): void => {
  console.log('Bot spot running')
  const launcherSpot: LauncherSpot = Container.getLauncherSpot()

  launcherSpot.start().catch((error: unknown): void => {
    console.error('Error in bot spot:', error)
  })
}
