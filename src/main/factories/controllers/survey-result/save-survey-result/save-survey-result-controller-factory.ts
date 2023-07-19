import { loggerControllerDecoratorFactory } from '@/main/factories/decorators/logger-controller-decorator-factory'
import { dbSaveSurveyResultFactory } from '@/main/factories/usecases/survey-result/save-survey-result/db-save-survey-result-factory'
import { dbLoadSurveyByIdFactory } from '@/main/factories/usecases/survey/load-survey-by-id/db-load-survey-by-id-factory'
import { SaveSurveyResultController } from '@/presentation/controllers/survey-result/save-survey-result/save-survey-result-controller'
import { type Controller } from '@/presentation/protocols'

export const saveSurveyResultControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new SaveSurveyResultController(dbLoadSurveyByIdFactory(), dbSaveSurveyResultFactory())
  )
}
