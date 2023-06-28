import { type AccountModel, type LoadAccountByToken, type Decrypter } from './db-add-account-protocols'

export class DbLoadAccountByToken implements LoadAccountByToken {
  constructor (
    private readonly decrypter: Decrypter
  ) {}

  async load (accessToken: string, role?: string): Promise<AccountModel | null> {
    await this.decrypter.decrypt(accessToken)
    return null
  }
}
