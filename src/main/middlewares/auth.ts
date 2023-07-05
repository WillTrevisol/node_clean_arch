import { middlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { authMiddlewareFactory } from '../factories/middlewares/auth-middleware-factory'

export const auth = middlewareAdapter(authMiddlewareFactory())
