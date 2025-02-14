export const tradingModeOptions = ['spot', 'futures'] as const

export type TradingMode = (typeof tradingModeOptions)[number]
