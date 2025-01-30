import { Request, Response, Router } from 'express'
import {
  getEquityFuturesGraph,
  getEquitySpotGraph,
} from './controllers/equity-controller'

const router: Router = Router()

router.get('/', (req: Request, res: Response): void => {
  res.send({})
})

router.get('/uptime', (req: Request, res: Response): void => {
  res.send({ data: process.uptime() })
})

const spotRouter: Router = Router()
spotRouter.get('/graph/equity', getEquitySpotGraph)

const futuresRouter: Router = Router()
futuresRouter.get('/graph/equity', getEquityFuturesGraph)

router.use('/spot', spotRouter)
router.use('/futures', futuresRouter)

export default router
