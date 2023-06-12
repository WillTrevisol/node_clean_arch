import { type Express, Router } from 'express'
import fastblob from 'fast-glob'

export default (app: Express): void => {
  const router = Router()
  app.use('/api', router)
  fastblob.sync('**/src/main/routes/**routes.ts').map(
    async file => {
      (await import(`../../../${file}`)).default(router)
    }
  )
}
