import { type AddAccountRepository } from '../../../../data/protocols/add-account-repository'
import { type AccountModel } from '../../../../domain/models'
import { type AddAccountModel } from '../../../../domain/usecases'
import { MongoHelper } from '../helpers/mongo-helpers'

export class AccountMongoRepository implements AddAccountRepository {
  async add (accountData: AddAccountModel): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getColletion('accounts')
    const result = await accountColletion.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }
}
