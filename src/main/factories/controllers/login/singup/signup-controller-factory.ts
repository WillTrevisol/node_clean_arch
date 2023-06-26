import { SignUpController } from '../../../../../presentation/controllers/login/signup/signup-controller'
import { type Controller } from '../../../../../presentation/controllers/login/signup/signup-controller-protocols'
import { singupValidationFactory } from './signup-validation-factory'
import { dbAuthenticationFactory } from '../../../usecases/authentication/db-authentication-factory'
import { dbAddAccountFactory } from '../../../usecases/add-account/db-add-account-factory'
import { loggerControllerDecoratorFactory } from '../../../decorators/logger-controller-decorator-factory'

export const signupControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new SignUpController(dbAddAccountFactory(), singupValidationFactory(), dbAuthenticationFactory())
  )
}
