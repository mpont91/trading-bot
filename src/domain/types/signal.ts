import { Signal } from '@prisma/client'
import { z } from 'zod'

export { Signal } from '@prisma/client'

export const signalSchema = z.enum(Signal)
