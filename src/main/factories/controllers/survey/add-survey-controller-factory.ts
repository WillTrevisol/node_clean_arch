import { type Controller } from '../../../../presentation/protocols'
import { loggerControllerDecoratorFactory } from '../../decorators/logger-controller-decorator-factory'
import { AddSurveyController } from '../../../../presentation/controllers/survey/add-survey/add-survey-controller'
import { addSurveyValidationFactory } from './add-survey-validation-factory'
import { dbAddSurveyFactory } from '../../usecases/add-survey/db-add-account-factory'

export const addSurveyControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new AddSurveyController(addSurveyValidationFactory(), dbAddSurveyFactory())
  )
}
