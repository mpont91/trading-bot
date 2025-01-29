import winston, { createLogger, Logger } from 'winston'
import DailyRotateFile from 'winston-daily-rotate-file'

const dailyRotateFileTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '5d',
})

const errorTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/error-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '5d',
  level: 'error',
})

const exceptionTransport: DailyRotateFile = new DailyRotateFile({
  filename: 'logs/exception-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '5d',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
})

export const logger: Logger = createLogger({
  level: 'debug',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [dailyRotateFileTransport, errorTransport],
  exceptionHandlers: [exceptionTransport],
})
