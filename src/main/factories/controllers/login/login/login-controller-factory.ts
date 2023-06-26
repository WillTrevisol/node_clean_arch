import { loginValidationFactory } from './login-validation-factory'
import { LoginController } from '../../../../../presentation/controllers/login/login/login-controller'
import { type Controller } from '../../../../../presentation/protocols'
import { dbAuthenticationFactory } from '../../../usecases/authentication/db-authentication-factory'
import { loggerControllerDecoratorFactory } from '../../../decorators/logger-controller-decorator-factory'

export const loginControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new LoginController(loginValidationFactory(), dbAuthenticationFactory())
  )
}
