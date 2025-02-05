import { Side, sideOptions } from '../../domain/types/side'

export function sideRule(value: string): void {
  const options = sideOptions
  if (!options.includes(value as Side)) {
    throw new Error(
      `Side parameter must be one of the following: [${options.join(', ')}]`,
    )
  }
}
