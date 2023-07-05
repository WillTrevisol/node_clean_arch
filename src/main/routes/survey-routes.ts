import { type Router } from 'express'
import { routeAdapter } from '../adapters/express/express-routes-adapter'
import { addSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'
import { loadSurveysControllerFactory } from '../factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { adminAuth } from '../middlewares/admin-auth'
import { auth } from '../middlewares/auth'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, routeAdapter(addSurveyControllerFactory()))
  router.get('/surveys', auth, routeAdapter(loadSurveysControllerFactory()))
}
