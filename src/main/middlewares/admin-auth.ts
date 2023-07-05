import { middlewareAdapter } from '../adapters/express/express-middleware-adapter'
import { authMiddlewareFactory } from '../factories/middlewares/auth-middleware-factory'

export const adminAuth = middlewareAdapter(authMiddlewareFactory('admin'))
