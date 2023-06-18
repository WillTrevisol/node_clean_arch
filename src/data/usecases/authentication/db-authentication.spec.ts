import { type Authentication, type AccountModel, type AuthenticationModel } from '../add-account/db-add-account-protocols'
import { type LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository'
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

interface SutTypes {
  systemUnderTest: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
}

const sutFactory = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryFactory()
  const hashCompareStub = hashCompareFactory()
  const systemUnderTest = new DbAuthentication(loadAccountByEmailRepositoryStub, hashCompareStub)

  return {
    systemUnderTest,
    loadAccountByEmailRepositoryStub,
    hashCompareStub
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
})
