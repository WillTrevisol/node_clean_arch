import { saveSurveyResultControllerFactory } from '@/main/factories/controllers/survey-result/save-survey-result/save-survey-result-controller-factory'
import { routeAdapter } from '@/main/adapters/express/express-routes-adapter'
import { auth } from '@/main/middlewares/auth'
import { type Router } from 'express'

export default (router: Router): void => {
  router.put('/surveys/:surveyId/results', auth, routeAdapter(saveSurveyResultControllerFactory()))
}
