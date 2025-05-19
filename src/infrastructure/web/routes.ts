import { Request, Response, Router } from 'express'
import {
  getEquityFullGraph,
  getEquityFuturesGraph,
  getEquitySpotGraph,
} from './controllers/equity-controller'
import { getCommissionEquitySpot } from './controllers/commission-equity-controller'
import {
  getPerformanceFull,
  getPerformanceFutures,
  getPerformanceSpot,
} from './controllers/performance-controller'
import {
  getLastTradesFutures,
  getLastTradesSpot,
} from './controllers/trade-controller'
import {
  getLastOpportunitiesSpot,
  getLastStrategiesSpot,
  getSignalsGraphSpot,
  getLastOpportunitiesFutures,
  getLastStrategiesFutures,
  getSignalsGraphFutures,
} from './controllers/strategy-controller'

const router: Router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.send({})
})

router.get('/uptime', (req: Request, res: Response): void => {
  res.send({ data: process.uptime() })
})

router.get('/performance', getPerformanceFull)
router.get('/graph/equity', getEquityFullGraph)

const spotRouter: Router = Router()
spotRouter.get('/graph/equity', getEquitySpotGraph)
spotRouter.get('/commission-equity', getCommissionEquitySpot)
spotRouter.get('/performance', getPerformanceSpot)
spotRouter.get('/last-trades/:symbol?', getLastTradesSpot)
spotRouter.get('/market/last-strategies/:symbol?', getLastStrategiesSpot)
spotRouter.get('/market/last-opportunities/:symbol?', getLastOpportunitiesSpot)
spotRouter.get('/market/graph/signals/:symbol', getSignalsGraphSpot)

const futuresRouter: Router = Router()
futuresRouter.get('/graph/equity', getEquityFuturesGraph)
futuresRouter.get('/performance', getPerformanceFutures)
futuresRouter.get('/last-trades/:symbol?', getLastTradesFutures)
futuresRouter.get('/market/last-strategies/:symbol?', getLastStrategiesFutures)
futuresRouter.get(
  '/market/last-opportunities/:symbol?',
  getLastOpportunitiesFutures,
)
futuresRouter.get('/market/graph/signals/:symbol', getSignalsGraphFutures)

router.use('/spot', spotRouter)
router.use('/futures', futuresRouter)

export default router
