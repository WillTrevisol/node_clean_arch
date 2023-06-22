import { type Router } from 'express'
import { routeAdapter } from '../adapters/express/express-routes-adapter'
import { signupControllerFactory } from '../factories/signup/signup-factory'
import { loginControllerFactory } from '../factories/login/login-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(signupControllerFactory()))
  router.post('/login', routeAdapter(loginControllerFactory()))
}
