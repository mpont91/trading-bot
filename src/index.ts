import { server } from './server'
import { botMarket } from './bot-market'
import { botAccount } from './bot-account'
import { botTrading } from './bot-trading'

class App {
  private readonly runServer: boolean = true
  private readonly runMarket: boolean = true
  private readonly runTrading: boolean = true
  private readonly runAccount: boolean = true

  constructor(args: string[]) {
    const onlyServer: boolean = args.includes('--only-server')
    const onlyMarket: boolean = args.includes('--only-market')
    const onlyTrading: boolean = args.includes('--only-trading')
    const onlyAccount: boolean = args.includes('--only-account')

    if (onlyServer) {
      console.log('Running only server')
      this.runMarket = false
      this.runTrading = false
      this.runAccount = false
    }

    if (onlyMarket) {
      console.log('Running only bot market')
      this.runServer = false
      this.runTrading = false
      this.runAccount = false
    }

    if (onlyTrading) {
      console.log('Running only bot trading')
      this.runServer = false
      this.runMarket = false
      this.runAccount = false
    }

    if (onlyAccount) {
      console.log('Running only bot account')
      this.runServer = false
      this.runMarket = false
      this.runTrading = false
    }
  }

  start(): void {
    if (this.runServer) {
      server()
    }

    if (this.runMarket) {
      botMarket()
    }

    if (this.runTrading) {
      botTrading()
    }

    if (this.runAccount) {
      botAccount()
    }
  }
}

const app: App = new App(process.argv.slice(2))
app.start()
