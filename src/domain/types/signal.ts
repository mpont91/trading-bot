import { Signal } from '@prisma/client'
export { Signal } from '@prisma/client'

export function signalRule(value: string): asserts value is Signal {
  const options: Signal[] = Object.values(Signal)
  if (!options.includes(value as Signal)) {
    throw new Error(
      `Signal parameter must be one of the following: [${options.join(', ')}]`,
    )
  }
}
