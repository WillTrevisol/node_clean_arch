import { type Router } from 'express'
import { routeAdapter } from '../adapters/express-routes-adapter'
import { signupControllerFactory } from '../factories/signup/signup'

export default (router: Router): void => {
  router.post('/signup', routeAdapter(signupControllerFactory()))
}
