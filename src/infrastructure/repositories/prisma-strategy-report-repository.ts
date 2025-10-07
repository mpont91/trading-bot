import {
  StrategyReport as PrismaStrategyReport,
  Prisma,
  PrismaClient,
} from '@prisma/client'
import { StrategyReportRepository } from '../../domain/repositories/strategy-report-repository'
import {
  StrategyReport,
  StrategyReportCreate,
} from '../../domain/models/strategy-report'
import {
  domainStrategyReportSchema,
  prismaStrategyReportSchema,
} from './schemas/prisma-strategy-report-schema'

export class PrismaStrategyReportRepository
  implements StrategyReportRepository
{
  constructor(private readonly prisma: PrismaClient) {}

  async create(strategyReport: StrategyReportCreate): Promise<StrategyReport> {
    return this.toDomain(
      await this.prisma.strategyReport.create({
        data: this.toPrisma(strategyReport),
      }),
    )
  }

  private toDomain(prismaStrategyReport: PrismaStrategyReport): StrategyReport {
    return domainStrategyReportSchema.parse(prismaStrategyReport)
  }

  private toPrisma(
    strategyReportCreate: StrategyReportCreate,
  ): Prisma.StrategyReportCreateInput {
    return prismaStrategyReportSchema.parse(strategyReportCreate)
  }
}
