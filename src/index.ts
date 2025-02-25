import { server } from './server'
import { botMarket } from './bot-market'
import { botSpotTrading, botSpotAccount } from './bot-spot'
import { botFuturesTrading, botFuturesAccount } from './bot-futures'

class App {
  private readonly runServer: boolean = true
  private readonly runMarket: boolean = true
  private readonly runSpotTrading: boolean = true
  private readonly runSpotAccount: boolean = true
  private readonly runFuturesTrading: boolean = true
  private readonly runFuturesAccount: boolean = true

  constructor(args: string[]) {
    const onlyServer: boolean = args.includes('--only-server')
    const onlyMarket: boolean = args.includes('--only-market')
    const onlySpotTrading: boolean = args.includes('--only-spot-trading')
    const onlySpotAccount: boolean = args.includes('--only-spot-account')
    const onlyFuturesTrading: boolean = args.includes('--only-futures-trading')
    const onlyFuturesAccount: boolean = args.includes('--only-futures-account')

    if (onlyServer) {
      console.log('Running only server')
      this.runMarket = false
      this.runSpotTrading = false
      this.runSpotAccount = false
      this.runFuturesTrading = false
      this.runFuturesAccount = false
    }

    if (onlyMarket) {
      console.log('Running only bot market')
      this.runServer = false
      this.runSpotTrading = false
      this.runSpotAccount = false
      this.runFuturesTrading = false
      this.runFuturesAccount = false
    }

    if (onlySpotTrading) {
      console.log('Running only bot spot trading')
      this.runServer = false
      this.runMarket = false
      this.runSpotAccount = false
      this.runFuturesTrading = false
      this.runFuturesAccount = false
    }

    if (onlySpotAccount) {
      console.log('Running only bot spot account')
      this.runServer = false
      this.runMarket = false
      this.runSpotTrading = false
      this.runFuturesTrading = false
      this.runFuturesAccount = false
    }

    if (onlyFuturesTrading) {
      console.log('Running only bot futures trading')
      this.runServer = false
      this.runMarket = false
      this.runSpotTrading = false
      this.runSpotAccount = false
      this.runFuturesAccount = false
    }

    if (onlyFuturesAccount) {
      console.log('Running only bot futures account')
      this.runServer = false
      this.runMarket = false
      this.runSpotTrading = false
      this.runSpotAccount = false
      this.runFuturesTrading = false
    }
  }

  start(): void {
    if (this.runServer) {
      server()
    }

    if (this.runMarket) {
      botMarket()
    }

    if (this.runSpotTrading) {
      botSpotTrading()
    }

    if (this.runFuturesTrading) {
      botFuturesTrading()
    }

    if (this.runSpotAccount) {
      botSpotAccount()
    }

    if (this.runFuturesAccount) {
      botFuturesAccount()
    }
  }
}

const app: App = new App(process.argv.slice(2))
app.start()
