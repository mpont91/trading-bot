export const sideOptions = ['long', 'short'] as const

export type Side = (typeof sideOptions)[number]
