import { authMiddlewareFactory } from '@/main/factories/middlewares/auth-middleware-factory'
import { middlewareAdapter } from '@/main/adapters/express/express-middleware-adapter'

export const auth = middlewareAdapter(authMiddlewareFactory())
