type Fn = (args: string[]) => Promise<void>

const scripts: Record<string, Fn> = {
  'api-get-balance': async () => {
    await (await import('./api/api-get-balance')).default()
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
  'position-close': async (args: string[]) => {
    await (await import('./position/position-close')).default(args)
  },
  'position-get': async (args: string[]) => {
    await (await import('./position/position-get')).default(args)
  },
  'position-open': async (args: string[]) => {
    await (await import('./position/position-open')).default(args)
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
