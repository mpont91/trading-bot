import { server } from './server'
import { botMarket } from './bot-market'
import { botSpot } from './bot-spot'
import { botFutures } from './bot-futures'

class App {
  private readonly runServer: boolean = true
  private readonly runBotMarket: boolean = true
  private readonly runBotSpot: boolean = true
  private readonly runBotFutures: boolean = true

  constructor(args: string[]) {
    const onlyServer: boolean = args.includes('--only-server')
    const onlyBotMarket: boolean = args.includes('--only-bot-market')
    const onlyBotSpot: boolean = args.includes('--only-bot-spot')
    const onlyBotFutures: boolean = args.includes('--only-bot-futures')

    if (onlyServer) {
      console.log('Running only server')
      this.runBotMarket = false
      this.runBotSpot = false
      this.runBotFutures = false
    }

    if (onlyBotMarket) {
      console.log('Running only bot market')
      this.runServer = false
      this.runBotFutures = false
      this.runBotSpot = false
    }

    if (onlyBotSpot) {
      console.log('Running only bot spot')
      this.runServer = false
      this.runBotMarket = false
      this.runBotFutures = false
    }

    if (onlyBotFutures) {
      console.log('Running only bot futures')
      this.runServer = false
      this.runBotMarket = false
      this.runBotSpot = false
    }
  }

  start(): void {
    if (this.runServer) {
      server()
    }

    if (this.runBotMarket) {
      botMarket()
    }

    if (this.runBotSpot) {
      botSpot()
    }

    if (this.runBotSpot) {
      botFutures()
    }
  }
}

const app: App = new App(process.argv.slice(2))
app.start()
