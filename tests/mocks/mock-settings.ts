import { IndicatorsRulesSettings } from '../../src/domain/types/settings'

export function mockIndicatorsRulesSettings(): IndicatorsRulesSettings {
  return {
    side: [
      {
        value: 'long',
        conditions: [
          { indicator: 'rsi', period: 7, threshold: 40, condition: '<' },
          { indicator: 'rsi', period: 14, threshold: 50, condition: '<' },
          { indicator: 'adx', period: 14, threshold: 25, condition: '>' },
          {
            indicator: 'sma',
            period: 20,
            compareWith: { indicator: 'sma', period: 50 },
            condition: '>',
          },
        ],
      },
      {
        value: 'short',
        conditions: [
          { indicator: 'rsi', period: 7, threshold: 60, condition: '>' },
          { indicator: 'rsi', period: 14, threshold: 50, condition: '>' },
          { indicator: 'adx', period: 14, threshold: 25, condition: '>' },
          {
            indicator: 'sma',
            period: 20,
            compareWith: { indicator: 'sma', period: 50 },
            condition: '<',
          },
        ],
      },
      {
        value: 'hold',
        conditions: [],
      },
    ],
    leverage: [
      {
        value: 10,
        conditions: [
          { indicator: 'adx', period: 14, threshold: 35, condition: '>' },
        ],
      },
      {
        value: 5,
        conditions: [
          { indicator: 'adx', period: 14, threshold: 25, condition: '>' },
        ],
      },
      {
        value: 1,
        conditions: [],
      },
    ],
    tp: {
      atr: [
        {
          period: 14,
          multiplier: 3,
        },
        {
          period: 10,
          multiplier: 2.5,
        },
      ],
      min: 0.03, // 3%
      max: 0.1, // 10%
    },
    sl: {
      atr: [
        {
          period: 14,
          multiplier: 1.5,
        },
        {
          period: 10,
          multiplier: 1.25,
        },
      ],
      min: 0.02, // 2%
      max: 0.08, // 8%
    },
  }
}
