import { type AccountModel } from '@/domain/models'
import { type AddAccountParams } from '@/domain/usecases'
import { type AddAccountRepository } from '@/data/protocols/db/account/add-account-repository'
import { type LoadAccountByEmailRepository } from '@/data/protocols/db/account/load-account-by-email-repository'
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { type UpdateAccessTokenRepository } from '@/data/protocols/db/account/update-access-token-repository'
import { MongoHelper } from '@/infra/db/mongodb/helpers/mongo-helpers'

export class AccountMongoRepository implements AddAccountRepository, LoadAccountByEmailRepository, UpdateAccessTokenRepository, LoadAccountByTokenRepository {
  async add (accountData: AddAccountParams): Promise<AccountModel> {
    const accountColletion = await MongoHelper.getColletion('accounts')
    const result = await accountColletion.insertOne(accountData)
    return MongoHelper.map(result.ops[0])
  }

  async loadByEmail (email: string): Promise<AccountModel | null> {
    const accountColletion = await MongoHelper.getColletion('accounts')
    const account = await accountColletion.findOne({ email })
    return account && MongoHelper.map(account)
  }

  async updateAccessToken (id: string, accessToken: string): Promise<void> {
    const accountColletion = await MongoHelper.getColletion('accounts')
    await accountColletion.updateOne(
      { _id: id },
      {
        $set: {
          accessToken
        }
      }
    )
  }

  async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
    const accountColletion = await MongoHelper.getColletion('accounts')
    const account = await accountColletion.findOne({
      accessToken: token,
      $or: [{
        role
      }, {
        role: 'admin'
      }]
    })
    return account && MongoHelper.map(account)
  }
}
