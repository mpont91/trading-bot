import { Request, Response, Router } from 'express'
import { getEquityGraph } from './controllers/equity-controller'
import { getCommissionEquity } from './controllers/commission-equity-controller'
import { getPerformance } from './controllers/performance-controller'
import { getLastTrades } from './controllers/trade-controller'
import {
  getLastOpportunities,
  getLastStrategies,
  getStrategyAnalysis,
} from './controllers/strategy-controller'
import { getGraphSMA } from './controllers/indicator-controller'

const router: Router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.send({})
})

router.get('/uptime', (req: Request, res: Response): void => {
  res.send({ data: process.uptime() })
})

router.get('/graph/equity', getEquityGraph)
router.get('/commission-equity', getCommissionEquity)
router.get('/performance', getPerformance)
router.get('/last-trades', getLastTrades)
router.get('/last-trades/:symbol', getLastTrades)
router.get('/market/last-strategies', getLastStrategies)
router.get('/market/last-strategies/:symbol', getLastStrategies)
router.get('/market/last-opportunities', getLastOpportunities)
router.get('/market/last-opportunities/:symbol', getLastOpportunities)
router.get('/market/graph/strategy-analysis/:symbol', getStrategyAnalysis)
router.get('/market/graph/indicator/sma/:symbol', getGraphSMA)

export default router
