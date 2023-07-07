import { dbAddSurveyFactory } from '@/main/factories/usecases/survey/add-survey/db-add-account-factory'
import { loggerControllerDecoratorFactory } from '@/main/factories/decorators/logger-controller-decorator-factory'
import { AddSurveyController } from '@/presentation/controllers/survey/add-survey/add-survey-controller'
import { type Controller } from '@/presentation/protocols'
import { addSurveyValidationFactory } from './add-survey-validation-factory'

export const addSurveyControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new AddSurveyController(addSurveyValidationFactory(), dbAddSurveyFactory())
  )
}
