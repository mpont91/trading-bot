import { settings } from './settings'
import { logger } from '../infrastructure/logger/winston-logger'
import { ManagerInterface } from '../domain/managers/manager-interface'

export class Launcher {
  private readonly intervalReportTime: number = settings.intervalReportTime
  private readonly intervalExecutionTime: number =
    settings.intervalExecutionTime

  constructor(
    private readonly executionManagers: ManagerInterface[],
    private readonly reportManagers: ManagerInterface[],
  ) {}

  async start(): Promise<void> {
    logger.info('Launcher is about to start for the first time.')
    await this.report()
    await this.execute()
    setInterval(async (): Promise<void> => {
      await this.report()
    }, this.intervalReportTime)
    setInterval(async (): Promise<void> => {
      await this.execute()
    }, this.intervalExecutionTime)
  }

  private async execute(): Promise<void> {
    logger.info('Launcher is going to start the execution managers.')
    try {
      for (const manager of this.executionManagers) {
        await manager.start()
      }
    } catch (error: unknown) {
      logger.error('Something went wrong with execution managers', error)
      console.error('Something went wrong with execution managers', error)
    }
  }

  private async report(): Promise<void> {
    logger.info('Launcher is going to start the report managers.')
    try {
      for (const manager of this.reportManagers) {
        await manager.start()
      }
    } catch (error: unknown) {
      logger.error('Something went wrong with report managers', error)
      console.error('Something went wrong with report managers', error)
    }
  }
}
