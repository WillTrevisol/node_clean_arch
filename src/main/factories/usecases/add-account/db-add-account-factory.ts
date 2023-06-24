import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '../../../../infra/criptography/bcrypt-adapter/bcrypt-adapter'
import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account'

export const dbAddAccountFactory = (): DbAddAccount => {
  const salt = 12
  const encrypt = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  return new DbAddAccount(encrypt, addAccountRepository, addAccountRepository)
}
