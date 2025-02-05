import { Side } from '../types/side'
import { sideRule } from '../../application/rules/side-rule'

export function inverseSide(side: Side): Side {
  sideRule(side)
  return side === 'long' ? 'short' : 'long'
}
