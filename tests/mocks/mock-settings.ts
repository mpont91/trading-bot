import { IndicatorsRulesSettings } from '../../src/domain/types/settings'

export function mockIndicatorsRulesForSideEvaluationSettings(): IndicatorsRulesSettings {
  return {
    side: [
      {
        value: 'long',
        conditions: [
          { indicator: 'rsi', period: 7, threshold: 40, condition: '<' },
          { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
          { indicator: 'sma', period: 20, threshold: 50, condition: '>' },
        ],
      },
      {
        value: 'short',
        conditions: [
          { indicator: 'rsi', period: 7, threshold: 60, condition: '>' },
          { indicator: 'adx', period: 10, threshold: 20, condition: '>' },
          { indicator: 'sma', period: 20, threshold: 50, condition: '<' },
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
    tp: [],
    sl: [],
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
    tp: [],
    sl: [],
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
    tp: [
      {
        period: 14,
        multiplier: 2.5,
      },
      {
        period: 10,
        multiplier: 3,
      },
    ],
    sl: [
      {
        period: 14,
        multiplier: 1.25,
      },
      {
        period: 10,
        multiplier: 1.5,
      },
    ],
  }
}
