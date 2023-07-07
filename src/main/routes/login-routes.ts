import { signupControllerFactory } from '@/main/factories/controllers/login/singup/signup-controller-factory'
import { loginControllerFactory } from '@/main/factories/controllers/login/login/login-controller-factory'
import { routeAdapter } from '@/main/adapters/express/express-routes-adapter'
import { type Router } from 'express'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(signupControllerFactory()))
  router.post('/login', routeAdapter(loginControllerFactory()))
}
