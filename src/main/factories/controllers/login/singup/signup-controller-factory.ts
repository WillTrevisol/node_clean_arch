import { dbAuthenticationFactory } from '@/main/factories/usecases/account/authentication/db-authentication-factory'
import { loggerControllerDecoratorFactory } from '@/main/factories/decorators/logger-controller-decorator-factory'
import { dbAddAccountFactory } from '@/main/factories/usecases/account/add-account/db-add-account-factory'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { type Controller } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { singupValidationFactory } from './signup-validation-factory'

export const signupControllerFactory = (): Controller => {
  return loggerControllerDecoratorFactory(
    new SignUpController(dbAddAccountFactory(), singupValidationFactory(), dbAuthenticationFactory())
  )
}
