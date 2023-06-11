import { type AddAccount, type AddAccountModel } from '../../../domain/usecases'
import { type AccountModel } from '../../../domain/models'
import { type Encrypter } from '../../protocols/encrypter'

export class DbAddAccount implements AddAccount {
  private readonly encrypter: Encrypter

  constructor (encrypter: Encrypter) {
    this.encrypter = encrypter
  }

  async add (account: AddAccountModel): Promise<AccountModel> {
    await this.encrypter.encrypt(account.password)
    return Promise.resolve({ id: '', name: '', email: '', password: '' })
  }
}
