export const sideOptions = ['long', 'short', 'hold'] as const

export type Side = (typeof sideOptions)[number]
