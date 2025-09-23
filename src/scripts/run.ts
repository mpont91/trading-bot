type Fn = (args: string[]) => Promise<void>

const scripts: Record<string, Fn> = {
  'api-get-balance': async () => {
    await (await import('./api/api-get-balance')).default()
  },
  'api-get-coins': async () => {
    await (await import('./api/api-get-coins')).default()
  },
  'api-get-commission-equity': async () => {
    await (await import('./api/api-get-commission-equity')).default()
  },
  'api-get-equity': async () => {
    await (await import('./api/api-get-equity')).default()
  },
  'api-get-kline': async (args: string[]) => {
    await (await import('./api/api-get-kline')).default(args)
  },
  'api-get-order': async (args: string[]) => {
    await (await import('./api/api-get-order')).default(args)
  },
  'api-get-position': async (args: string[]) => {
    await (await import('./api/api-get-position')).default(args)
  },
  'api-get-price': async (args: string[]) => {
    await (await import('./api/api-get-price')).default(args)
  },
  'api-get-symbol': async (args: string[]) => {
    await (await import('./api/api-get-symbol')).default(args)
  },
  'api-submit-order': async (args: string[]) => {
    await (await import('./api/api-submit-order')).default(args)
  },
  'commission-equity-get': async () => {
    await (await import('./commission-equity/commission-equity-get')).default()
  },
  'commission-equity-store': async () => {
    await (
      await import('./commission-equity/commission-equity-store')
    ).default()
  },
  'equity-graph': async (args: string[]) => {
    await (await import('./equity/equity-graph')).default(args)
  },
  'equity-store': async () => {
    await (await import('./equity/equity-store')).default()
  },
  'indicator-get-adx': async (args: string[]) => {
    await (await import('./indicator/indicator-get-adx')).default(args)
  },
  'indicator-get-atr': async (args: string[]) => {
    await (await import('./indicator/indicator-get-atr')).default(args)
  },
  'indicator-get-bb': async (args: string[]) => {
    await (await import('./indicator/indicator-get-bb')).default(args)
  },
  'indicator-get-rsi': async (args: string[]) => {
    await (await import('./indicator/indicator-get-rsi')).default(args)
  },
  'indicator-get-sma': async (args: string[]) => {
    await (await import('./indicator/indicator-get-sma')).default(args)
  },
  'indicator-get-sma-cross': async (args: string[]) => {
    await (await import('./indicator/indicator-get-sma-cross')).default(args)
  },
  'indicator-store-all': async (args: string[]) => {
    await (await import('./indicator/indicator-store-all')).default(args)
  },
  'investment-get-amount': async () => {
    await (await import('./investment/investment-get-amount')).default()
  },
  'investment-get-quantity': async (args: string[]) => {
    await (await import('./investment/investment-get-quantity')).default(args)
  },
  'order-get-last': async () => {
    await (await import('./order/order-get-last')).default()
  },
  'order-get-last-symbol': async (args: string[]) => {
    await (await import('./order/order-get-last-symbol')).default(args)
  },
  'performance-get': async () => {
    await (await import('./performance/performance-get')).default()
  },
  'position-check': async (args: string[]) => {
    await (await import('./position/position-check')).default(args)
  },
  'position-close': async (args: string[]) => {
    await (await import('./position/position-close')).default(args)
  },
  'position-get': async (args: string[]) => {
    await (await import('./position/position-get')).default(args)
  },
  'position-list': async () => {
    await (await import('./position/position-list')).default()
  },
  'position-open': async (args: string[]) => {
    await (await import('./position/position-open')).default(args)
  },
  'strategy-create': async (args: string[]) => {
    await (await import('./strategy/strategy-create')).default(args)
  },
  'trailing-list': async () => {
    await (await import('./trailing/trailing-list')).default()
  },
}

async function main(): Promise<void> {
  const [, , cmd, ...args] = process.argv

  const script = scripts[cmd]

  if (!script) {
    console.error(`Unknown script: ${cmd}`)
    process.exit(1)
  }

  await Promise.resolve(script(args))
}

main().catch((error) => {
  console.error('Script failed:', error)
  process.exit(1)
})
