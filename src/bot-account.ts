import { Container } from './di'
import { Launcher } from './application/launcher'

export const botAccount = (): void => {
  console.log('Bot account running')
  const launcher: Launcher = Container.getLauncherSpotAccount()

  launcher.start().catch((error: unknown): void => {
    console.error('Error in bot account:', error)
  })
}
