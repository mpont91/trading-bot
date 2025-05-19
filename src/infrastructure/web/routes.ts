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

const marketRouter: Router = Router()
marketRouter.get('/spot/last-strategies/:symbol?', getLastStrategiesSpot)
marketRouter.get('/spot/last-opportunities/:symbol?', getLastOpportunitiesSpot)
marketRouter.get('/spot/graph/signals/:symbol', getSignalsGraphSpot)
marketRouter.get('/futures/last-strategies/:symbol?', getLastStrategiesFutures)
marketRouter.get(
  '/futures/last-opportunities/:symbol?',
  getLastOpportunitiesFutures,
)
marketRouter.get('/futures/graph/signals/:symbol', getSignalsGraphFutures)

const spotRouter: Router = Router()
spotRouter.get('/graph/equity', getEquitySpotGraph)
spotRouter.get('/commission-equity', getCommissionEquitySpot)
spotRouter.get('/performance', getPerformanceSpot)
spotRouter.get('/last-trades/:symbol?', getLastTradesSpot)

const futuresRouter: Router = Router()
futuresRouter.get('/graph/equity', getEquityFuturesGraph)
futuresRouter.get('/performance', getPerformanceFutures)
futuresRouter.get('/last-trades/:symbol?', getLastTradesFutures)

router.use('/market', marketRouter)
router.use('/spot', spotRouter)
router.use('/futures', futuresRouter)

export default router
