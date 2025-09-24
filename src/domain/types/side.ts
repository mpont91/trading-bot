import { Side } from '@prisma/client'
export { Side } from '@prisma/client'

export function sideRule(value: string): asserts value is Side {
  const options: Side[] = Object.values(Side)
  if (!options.includes(value as Side)) {
    throw new Error(
      `Side parameter must be one of the following: [${options.join(', ')}]`,
    )
  }
}
