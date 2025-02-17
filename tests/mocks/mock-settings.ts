import { IndicatorsRulesSettings } from '../../src/domain/types/settings'

export function mockIndicatorsRulesForSideEvaluationSettings(): IndicatorsRulesSettings {
  return {
    side: [
      {
        value: 'long',
        conditions: [
          { indicator: 'rsi', period: 7, threshold: 40, condition: '<' },
          { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
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
          { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
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
        value: 1,
        conditions: [],
      },
    ],
    tp: {
      atr: [],
      min: 0.03, // 3%
      max: 0.1, // 10%
    },
    sl: {
      atr: [],
      min: 0.02, // 2%
      max: 0.08, // 8%
    },
  }
}

export function mockIndicatorsRulesForLeverageEvaluationSettings(): IndicatorsRulesSettings {
  return {
    side: [
      {
        value: 'long',
        conditions: [],
      },
    ],
    leverage: [
      {
        value: 10,
        conditions: [
          { indicator: 'adx', period: 10, threshold: 30, condition: '>' },
        ],
      },
      {
        value: 5,
        conditions: [
          { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
        ],
      },
      {
        value: 1,
        conditions: [],
      },
    ],
    tp: {
      atr: [],
      min: 0.03, // 3%
      max: 0.1, // 10%
    },
    sl: {
      atr: [],
      min: 0.02, // 2%
      max: 0.08, // 8%
    },
  }
}

export function mockIndicatorsRulesForTPSLEvaluationSettings(): IndicatorsRulesSettings {
  return {
    side: [
      {
        value: 'long',
        conditions: [],
      },
    ],
    leverage: [
      {
        value: 1,
        conditions: [],
      },
    ],
    tp: {
      atr: [
        {
          period: 14,
          multiplier: 2.5,
        },
        {
          period: 10,
          multiplier: 3,
        },
      ],
      min: 0.03, // 3%
      max: 0.1, // 10%
    },
    sl: {
      atr: [
        {
          period: 14,
          multiplier: 1.25,
        },
        {
          period: 10,
          multiplier: 1.5,
        },
      ],
      min: 0.02, // 2%
      max: 0.08, // 8%
    },
  }
}
