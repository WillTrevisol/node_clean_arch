import { type Router } from 'express'
import { routeAdapter } from '../adapters/express/express-routes-adapter'
import { signupControllerFactory } from '../factories/controllers/singup/signup-controller-factory'
import { loginControllerFactory } from '../factories/controllers/login/login-controller-factory'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(signupControllerFactory()))
  router.post('/login', routeAdapter(loginControllerFactory()))
}
