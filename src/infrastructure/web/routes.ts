import { Request, Response, Router } from 'express'
import { getEquityGraph } from './controllers/equity-controller'
import { getCommissionEquity } from './controllers/commission-equity-controller'
import { getPerformance } from './controllers/performance-controller'
import { getLastTrades } from './controllers/trade-controller'
import { getStrategyAnalysis } from './controllers/strategy-controller'

const router: Router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.send({})
})

router.get('/uptime', (req: Request, res: Response): void => {
  res.send({ data: process.uptime() })
})

router.get('/equity/graph', getEquityGraph)
router.get('/commission-equity', getCommissionEquity)
router.get('/performance', getPerformance)
router.get('/performance/:symbol', getPerformance)
router.get('/last-trades', getLastTrades)
router.get('/last-trades/:symbol', getLastTrades)
router.get('/strategy-analysis/:symbol', getStrategyAnalysis)

export default router
