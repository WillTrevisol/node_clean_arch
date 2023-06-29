import { type Router } from 'express'
import { routeAdapter } from '../adapters/express/express-routes-adapter'
import { addSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { authMiddlewareFactory } from '../factories/middlewares/auth-middleware-factory'
import { middlewareAdapter } from '../adapters/express/express-middleware-adapter'

export default (router: Router): void => {
  const adminAuth = middlewareAdapter(authMiddlewareFactory('admin'))
  router.post('/surveys', adminAuth, routeAdapter(addSurveyControllerFactory()))
}
