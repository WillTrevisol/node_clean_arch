import { type Router } from 'express'
import { routeAdapter } from '../adapters/express/express-routes-adapter'
import { addSurveyControllerFactory } from '../factories/controllers/survey/add-survey/add-survey-controller-factory'

export default (router: Router): void => {
  router.post('/surveys', routeAdapter(addSurveyControllerFactory()))
}
