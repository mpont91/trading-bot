import { logger } from '../infrastructure/logger/winston-logger'
import { ManagerInterface } from '../domain/managers/manager-interface'

export class Launcher {
  constructor(
    private readonly interval: number,
    private readonly managers: ManagerInterface[],
  ) {}

  async start(): Promise<void> {
    logger.info('Launcher is about to start for the first time.')
    await this.execute()
    setInterval(async (): Promise<void> => {
      await this.execute()
    }, this.interval)
  }

  private async execute(): Promise<void> {
    logger.info('Launcher is going to start the managers.')
    try {
      for (const manager of this.managers) {
        await manager.start()
      }
    } catch (error: unknown) {
      logger.error('Something went wrong with managers', error)
      console.error('Something went wrong with managers', error)
    }
  }
}
