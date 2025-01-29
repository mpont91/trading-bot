import express, { Express } from 'express'
import cors from 'cors'
import routes from './infrastructure/web/routes'

const app: Express = express()
const port: string | number = process.env.PORT || 3000

app.use(
  cors({
    origin: ['https://trading.mpont91.com', 'http://localhost:4321'],
  }),
)

app.use('/', routes)

export const server = (): void => {
  app.listen(port, (): void => {
    console.log(`Server running at http://localhost:${port}`)
  })
}
