import { type Controller } from '../../../../../presentation/protocols'
import { loggerControllerDecoratorFactory } from '../../../decorators/logger-controller-decorator-factory'
import { LoadSurveysController } from '../../../../../presentation/controllers/survey/load-surveys/load-surveys-controller'
import { dbLoadSurveysFactory } from '../../../usecases/survey/load-surveys/db-load-surveys-factory'

export const loadSurveysControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new LoadSurveysController(dbLoadSurveysFactory())
  )
}
