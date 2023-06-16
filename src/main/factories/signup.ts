import { SignUpController } from '../../presentation/controllers/signup/signup'
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter'
import { DbAddAccount } from '../../data/usecases/add-account/db-add-account'
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter'
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account'
import { LogMongoRepository } from '../../infra/db/mongodb/log-repository/log'
import { type Controller } from '../../presentation/controllers/signup/signup-protocols'
import { LoggerControllerDecorator } from '../decorators/log'
import { singupValidationFactory } from './signup-validation'

export const signupControllerFactory = (): Controller => {
  const salt = 12
  const emailValidatorAdapter = new EmailValidatorAdapter()
  const encrypt = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  const dbAddAccount = new DbAddAccount(encrypt, addAccountRepository)
  const signupController = new SignUpController(emailValidatorAdapter, dbAddAccount, singupValidationFactory())
  const logMongoRepository = new LogMongoRepository()
  return new LoggerControllerDecorator(signupController, logMongoRepository)
}
