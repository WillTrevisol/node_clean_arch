import swaggerDocs from '@/main/docs'
import { noCache } from '@/main/middlewares'
import { serve, setup } from 'swagger-ui-express'
import { type Express } from 'express'

export default (app: Express): void => {
  app.use('/api-docs', noCache, serve, setup(swaggerDocs))
}
