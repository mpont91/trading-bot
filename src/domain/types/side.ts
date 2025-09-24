import { Side } from '@prisma/client'
export { Side } from '@prisma/client'

export function sideRule(value: string): asserts value is Side {
  if (!Object.values(Side).includes(value as Side)) {
    throw new Error(
      `Side parameter must be one of the following: [${Object.values(Side).join(', ')}]`,
    )
  }
}
