import { type Middleware } from '../../../presentation/protocols'
import { AuthMiddleware } from '../../../presentation/middlewares/auth-middleware'
import { dbLoadAccountByTokenFactory } from '../usecases/account/load-account-by-token/db-load-account-by-token-factory'

export const authMiddlewareFactory = (role?: string): Middleware => {
  return new AuthMiddleware(dbLoadAccountByTokenFactory(), role)
}
