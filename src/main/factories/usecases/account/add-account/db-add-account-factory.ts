import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { AccountMongoRepository } from '@/infra/db/mongodb/account/account-mongo-repository'
import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'

export const dbAddAccountFactory = (): DbAddAccount => {
  const salt = 12
  const encrypt = new BcryptAdapter(salt)
  const addAccountRepository = new AccountMongoRepository()
  return new DbAddAccount(encrypt, addAccountRepository, addAccountRepository)
}
