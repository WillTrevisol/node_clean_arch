import { type Authentication, type AccountModel, type AuthenticationModel } from '../add-account/db-add-account-protocols'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
import { type UpdateAccessTokenRepository } from '../../protocols/db/update-access-token-repository'
import { type TokenGenerator } from '../../protocols/criptography/token-generator'
import { type HashCompare } from '../../protocols/criptography/hash-compare'
import { DbAuthentication } from './db-authentication'

const fakeAccountFactory = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_password'
})

const fakeAuthenticationModel = (): AuthenticationModel => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})

const loadAccountByEmailRepositoryFactory = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async load (email: string): Promise<AccountModel> {
      return Promise.resolve(fakeAccountFactory())
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const hashCompareFactory = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashCompareStub()
}

const tokenGeneratorFactory = (): TokenGenerator => {
  class TokenGeneratorStub implements TokenGenerator {
    async generate (id: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new TokenGeneratorStub()
}

const updateAccessTokenRepositoryFactory = (): UpdateAccessTokenRepository => {
  class UpdateAccessTokenRepositoryStub implements UpdateAccessTokenRepository {
    async update (id: string, accessToken: string): Promise<void> {
      return Promise.resolve()
    }
  }

  return new UpdateAccessTokenRepositoryStub()
}

interface SutTypes {
  systemUnderTest: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  tokenGeneratorStub: TokenGenerator
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const sutFactory = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryFactory()
  const hashCompareStub = hashCompareFactory()
  const tokenGeneratorStub = tokenGeneratorFactory()
  const updateAccessTokenRepositoryStub = updateAccessTokenRepositoryFactory()
  const systemUnderTest = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  )

  return {
    systemUnderTest,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    tokenGeneratorStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load')
    await systemUnderTest.auth(fakeAuthenticationModel())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const result = systemUnderTest.auth(fakeAuthenticationModel())
    await expect(result).rejects.toThrow()
  })

  test('Should call HashCompare with correct password', async () => {
    const { systemUnderTest, hashCompareStub } = sutFactory()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await systemUnderTest.auth(fakeAuthenticationModel())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'hashed_password')
  })

  test('Should return null if HashCompare returns false', async () => {
    const { systemUnderTest, hashCompareStub } = sutFactory()
    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await systemUnderTest.auth(fakeAuthenticationModel())
    expect(accessToken).toBeFalsy()
  })

  test('Should call TokenGenerator with correct id', async () => {
    const { systemUnderTest, tokenGeneratorStub } = sutFactory()
    const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate')
    await systemUnderTest.auth(fakeAuthenticationModel())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if TokenGenerator throws', async () => {
    const { systemUnderTest, tokenGeneratorStub } = sutFactory()
    jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const result = systemUnderTest.auth(fakeAuthenticationModel())
    await expect(result).rejects.toThrow()
  })

  test('Should return AccessToken on success', async () => {
    const { systemUnderTest } = sutFactory()
    const accessToken = await systemUnderTest.auth(fakeAuthenticationModel())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = sutFactory()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'update')
    await systemUnderTest.auth(fakeAuthenticationModel())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = sutFactory()
    jest.spyOn(updateAccessTokenRepositoryStub, 'update').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const result = systemUnderTest.auth(fakeAuthenticationModel())
    await expect(result).rejects.toThrow()
  })
})
