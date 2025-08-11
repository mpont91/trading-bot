import { Container } from './di'
import { Launcher } from './application/launcher'

export const botTrading = (): void => {
  console.log('Bot trading running')
  const launcher: Launcher = Container.getLauncherTrading()

  launcher.start().catch((error: unknown): void => {
    console.error('Error in bot trading:', error)
  })
}
