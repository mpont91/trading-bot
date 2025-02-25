import { Container } from './di'
import { Launcher } from './application/launcher'

export const botSpotTrading = (): void => {
  console.log('Bot spot trading running')
  const launcher: Launcher = Container.getLauncherSpotTrading()

  launcher.start().catch((error: unknown): void => {
    console.error('Error in bot spot trading:', error)
  })
}

export const botSpotAccount = (): void => {
  console.log('Bot spot account running')
  const launcher: Launcher = Container.getLauncherSpotAccount()

  launcher.start().catch((error: unknown): void => {
    console.error('Error in bot spot account:', error)
  })
}
