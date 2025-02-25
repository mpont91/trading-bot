import { Container } from './di'
import { Launcher } from './application/launcher'

export const botFuturesTrading = (): void => {
  console.log('Bot futures trading running')
  const launcher: Launcher = Container.getLauncherFuturesTrading()

  launcher.start().catch((error: unknown): void => {
    console.error('Error in bot futures trading:', error)
  })
}

export const botFuturesAccount = (): void => {
  console.log('Bot futures account running')
  const launcher: Launcher = Container.getLauncherFuturesAccount()

  launcher.start().catch((error: unknown): void => {
    console.error('Error in bot futures account:', error)
  })
}
