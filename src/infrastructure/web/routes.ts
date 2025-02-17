import { Request, Response, Router } from 'express'
import {
  getEquityFuturesGraph,
  getEquitySpotGraph,
} from './controllers/equity-controller'
import { getCommissionEquitySpot } from './controllers/commission-equity-controller'
import {
  getPerformanceFutures,
  getPerformanceSpot,
} from './controllers/performance-controller'
import {
  getLatestTradesFutures,
  getLatestTradesSpot,
} from './controllers/trade-controller'
import { getIndicators } from './controllers/indicator-controller'
import {
  getLatestOpportunities,
  getStrategies,
} from './controllers/strategy-controller'
import { getRules } from './controllers/rules-controller'

const router: Router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.send({})
})

router.get('/uptime', (req: Request, res: Response): void => {
  res.send({ data: process.uptime() })
})

const marketRouter: Router = Router()
marketRouter.get('/indicators', getIndicators)
marketRouter.get('/strategies', getStrategies)
marketRouter.get('/latest-opportunities', getLatestOpportunities)
marketRouter.get('/rules', getRules)

const spotRouter: Router = Router()
spotRouter.get('/graph/equity', getEquitySpotGraph)
spotRouter.get('/commission-equity', getCommissionEquitySpot)
spotRouter.get('/performance', getPerformanceSpot)
spotRouter.get('/latest-trades', getLatestTradesSpot)

const futuresRouter: Router = Router()
futuresRouter.get('/graph/equity', getEquityFuturesGraph)
futuresRouter.get('/performance', getPerformanceFutures)
futuresRouter.get('/latest-trades', getLatestTradesFutures)

router.use('/market', marketRouter)
router.use('/spot', spotRouter)
router.use('/futures', futuresRouter)

export default router
