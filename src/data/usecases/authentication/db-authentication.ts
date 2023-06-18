import {
  type Authentication,
  type AuthenticationModel,
  type LoadAccountByEmailRepository,
  type UpdateAccessTokenRepository,
  type TokenGenerator,
  type HashCompare
} from './db-authentication-protocols'

export class DbAuthentication implements Authentication {
  private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
  private readonly hashCompare: HashCompare
  private readonly tokenGenerator: TokenGenerator
  private readonly updateAccessTokenRepository: UpdateAccessTokenRepository

  constructor (
    loadAccountByEmailRepository: LoadAccountByEmailRepository,
    hashCompare: HashCompare,
    tokenGenerator: TokenGenerator,
    updateAccessTokenRepository: UpdateAccessTokenRepository
  ) {
    this.loadAccountByEmailRepository = loadAccountByEmailRepository
    this.hashCompare = hashCompare
    this.tokenGenerator = tokenGenerator
    this.updateAccessTokenRepository = updateAccessTokenRepository
  }

  async auth (authentication: AuthenticationModel): Promise<string> {
    console.log(this.loadAccountByEmailRepository)
    console.log(this.hashCompare)
    const account = await this.loadAccountByEmailRepository.load(authentication.email)
    if (account) {
      const isValid = await this.hashCompare.compare(authentication.password, account.password)
      if (isValid) {
        const accessToken = await this.tokenGenerator.generate(account.id)
        await this.updateAccessTokenRepository.update(account.id, accessToken)
        return accessToken
      }
    }
    return ''
  }
}
