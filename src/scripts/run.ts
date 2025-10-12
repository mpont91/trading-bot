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
  'api-get-candles': async (args: string[]) => {
    await (await import('./api/api-get-candles')).default(args)
  },
  'api-get-order': async (args: string[]) => {
    await (await import('./api/api-get-order')).default(args)
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
  'backtester-fetch': async (args: string[]) => {
    await (await import('./backtester/backtester-fetch')).default(args)
  },
  'backtester-simulate': async (args: string[]) => {
    await (await import('./backtester/backtester-simulate')).default(args)
  },
  'commission-equity-get': async () => {
    await (await import('./commission-equity/commission-equity-get')).default()
  },
  'commission-equity-fetch-create': async () => {
    await (
      await import('./commission-equity/commission-equity-fetch-create')
    ).default()
  },
  'equity-graph': async (args: string[]) => {
    await (await import('./equity/equity-graph')).default(args)
  },
  'equity-fetch-create': async () => {
    await (await import('./equity/equity-fetch-create')).default()
  },
  'investment-fetch-calculate-amount': async () => {
    await (
      await import('./investment/investment-fetch-calculate-amount')
    ).default()
  },
  'investment-fetch-calculate-quantity': async (args: string[]) => {
    await (
      await import('./investment/investment-fetch-calculate-quantity')
    ).default(args)
  },
  'order-get': async (args: string[]) => {
    await (await import('./order/order-get')).default(args)
  },
  'order-list': async () => {
    await (await import('./order/order-list')).default()
  },
  'performance-get': async () => {
    await (await import('./performance/performance-get')).default()
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
  'trailing-list': async () => {
    await (await import('./trailing/trailing-list')).default()
  },
  'trailing-should-sell': async (args: string[]) => {
    await (await import('./trailing/trailing-should-sell')).default(args)
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
