import { Side } from '@prisma/client'
import { z } from 'zod'

export { Side } from '@prisma/client'

export const sideSchema = z.enum(Side)
