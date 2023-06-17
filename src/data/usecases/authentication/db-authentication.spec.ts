import { type LoadAccountByEmailRepository } from '../../protocols/load-account-by-email-repository'
import { type Authentication, type AccountModel, type AuthenticationModel } from '../add-account/db-add-account-protocols'
import { DbAuthentication } from './db-authentication'

const fakeAccountFactory = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
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

interface SutTypes {
  systemUnderTest: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const sutFactory = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryFactory()
  const systemUnderTest = new DbAuthentication(loadAccountByEmailRepositoryStub)

  return {
    systemUnderTest,
    loadAccountByEmailRepositoryStub
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
})
