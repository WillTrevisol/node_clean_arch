import { loadSurveysControllerFactory } from '@/main/factories/controllers/survey/load-surveys/load-surveys-controller-factory'
import { addSurveyControllerFactory } from '@/main/factories/controllers/survey/add-survey/add-survey-controller-factory'
import { routeAdapter } from '@/main/adapters/express/express-routes-adapter'
import { adminAuth } from '@/main/middlewares/admin-auth'
import { auth } from '@/main/middlewares/auth'
import { type Router } from 'express'

export default (router: Router): void => {
  router.post('/surveys', adminAuth, routeAdapter(addSurveyControllerFactory()))
  router.get('/surveys', auth, routeAdapter(loadSurveysControllerFactory()))
}
