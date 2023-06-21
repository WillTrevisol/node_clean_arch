import { SignUpController } from '../../../presentation/controllers/signup/signup-controller'
import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository'
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository'
import { type Controller } from '../../../presentation/controllers/signup/signup-controller-protocols'
import { LoggerControllerDecorator } from '../../decorators/log-controller-decorator'
import { singupValidationFactory } from './signup-validation-factory'

export const signupControllerFactory = (): Controller => {
  const salt = 12
  const encrypt = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)
  const signupController = new SignUpController(dbAddAccount, singupValidationFactory())
  const logMongoRepository = new LogMongoRepository()
  return new LoggerControllerDecorator(signupController, logMongoRepository)
}
