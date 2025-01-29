import { settings } from './settings'
import { logger } from '../infrastructure/logger/winston-logger'

export class LauncherFutures {
  constructor(
    private readonly intervalReportingTime: number = settings.intervalReportingTime,
    private readonly intervalExecutionTime: number = settings.intervalExecutionTime,
  ) {}

  async start(): Promise<void> {
    logger.info('Launcher futures is about to start for the first time.')
    await this.report()
    await this.execute()
    setInterval(async (): Promise<void> => {
      await this.report()
    }, this.intervalReportingTime)
    setInterval(async (): Promise<void> => {
      await this.execute()
    }, this.intervalExecutionTime)
  }

  private async execute(): Promise<void> {
    logger.info('Launcher futures is going to start the execution managers.')
    try {
      console.log('TODO: implement them')
    } catch (error: unknown) {
      logger.error('Something went wrong with execution managers', error)
      console.error('Something went wrong with execution managers', error)
    }
  }

  private async report(): Promise<void> {
    logger.info('Launcher futures is going to start the reporting managers.')
    try {
      console.log('TODO: implement them')
    } catch (error: unknown) {
      logger.error('Something went wrong with reporting managers', error)
      console.error('Something went wrong with reporting managers', error)
    }
  }
}
