import { loggerControllerDecoratorFactory } from '@/main/factories/decorators/logger-controller-decorator-factory'
import { dbLoadSurveysFactory } from '@/main/factories/usecases/survey/load-surveys/db-load-surveys-factory'
import { LoadSurveysController } from '@/presentation/controllers/survey/load-surveys/load-surveys-controller'
import { type Controller } from '@/presentation/protocols'

export const loadSurveysControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new LoadSurveysController(dbLoadSurveysFactory())
  )
}
