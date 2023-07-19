import { loggerControllerDecoratorFactory } from '@/main/factories/decorators/logger-controller-decorator-factory'
import { dbLoadSurveyResultFactory } from '@/main/factories/usecases/survey-result/load-survey-result/db-load-survey-result-factory'
import { dbLoadSurveyByIdFactory } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { LoadSurveyResultController } from '@/presentation/controllers/survey-result/load-survey-result/load-survey-result-controller'
import { type Controller } from '@/presentation/protocols'

export const loadSurveyResultControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new LoadSurveyResultController(dbLoadSurveyByIdFactory(), dbLoadSurveyResultFactory())
  )
}
