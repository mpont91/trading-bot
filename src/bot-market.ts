import { Container } from './di'
import { Launcher } from './application/launcher'

export const botMarket = (): void => {
  console.log('Bot market running')
  const launcherMarket: Launcher = Container.getLauncherMarket()

  launcherMarket.start().catch((error: unknown): void => {
    console.error('Error in bot market', error)
  })
}
