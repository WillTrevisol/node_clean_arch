import { dbAuthenticationFactory } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { loggerControllerDecoratorFactory } from '@/main/factories/decorators/logger-controller-decorator-factory'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { type Controller } from '@/presentation/protocols'
import { loginValidationFactory } from './login-validation-factory'

export const loginControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new LoginController(loginValidationFactory(), dbAuthenticationFactory())
  )
}
