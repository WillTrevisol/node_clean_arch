import { dbLoadAccountByTokenFactory } from '@/main/factories/usecases/account/load-account-by-token/db-load-account-by-token-factory'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { type Middleware } from '@/presentation/protocols'

export const authMiddlewareFactory = (role?: string): Middleware => {
  return new AuthMiddleware(dbLoadAccountByTokenFactory(), role)
}
