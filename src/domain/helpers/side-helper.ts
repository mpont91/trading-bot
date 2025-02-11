import { Side } from '../types/side'
import { sideRule } from '../../application/rules/side-rule'

export function inverseSide(side: Side): Side {
  sideRule(side)
  switch (side) {
    case 'long':
      return 'short'
    case 'short':
      return 'long'
    default:
      throw new Error('Cannot inverse hold side!')
  }
}
