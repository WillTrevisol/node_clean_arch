import { type AccountModel } from '@/domain/models'
import { type LoadAccountByTokenRepository } from '@/data/protocols/db/account/load-account-by-token-repository'
import { DbLoadAccountByToken } from '@/data/usecases/account/load-account-by-token/db-load-account-by-token'
import { type Decrypter } from '@/data/protocols/criptography/decrypter'
import { mockAccountModel } from '@/tests/domain/mocks'
import { mockDecrypter } from '@/tests/data/mocks'

const loadAccountByTokenRepositoryStubFactory = (): LoadAccountByTokenRepository => {
  class LoadAccountByTokenRepositoryStub implements LoadAccountByTokenRepository {
    async loadByToken (token: string, role?: string): Promise<AccountModel | null> {
      return Promise.resolve(mockAccountModel())
    }
  }
  return new LoadAccountByTokenRepositoryStub()
}

type SutTypes = {
  systemUnderTest: DbLoadAccountByToken
  decrypterStub: Decrypter
  loadAccountByTokenRepositoryStub: LoadAccountByTokenRepository
}

const sutFactory = (): SutTypes => {
  const loadAccountByTokenRepositoryStub = loadAccountByTokenRepositoryStubFactory()
  const decrypterStub = mockDecrypter()
  const systemUnderTest = new DbLoadAccountByToken(decrypterStub, loadAccountByTokenRepositoryStub)

  return {
    systemUnderTest,
    decrypterStub,
    loadAccountByTokenRepositoryStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { systemUnderTest, decrypterStub } = sutFactory()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await systemUnderTest.load('any_token', 'any_role')
    expect(decryptSpy).toBeCalledWith('any_token')
  })

  test('Should return null if Decrypter returns null', async () => {
    const { systemUnderTest, decrypterStub } = sutFactory()
    jest.spyOn(decrypterStub, 'decrypt').mockResolvedValueOnce(null)
    const account = await systemUnderTest.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByTokenRepository with correct values', async () => {
    const { systemUnderTest, loadAccountByTokenRepositoryStub } = sutFactory()
    const loadByTokenSpy = jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken')
    await systemUnderTest.load('any_token', 'any_role')
    expect(loadByTokenSpy).toBeCalledWith('any_token', 'any_role')
  })

  test('Should return null if LoadAccountByTokenRepository returns null', async () => {
    const { systemUnderTest, loadAccountByTokenRepositoryStub } = sutFactory()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockResolvedValueOnce(null)
    const account = await systemUnderTest.load('any_token', 'any_role')
    expect(account).toBeNull()
  })

  test('Should return an account on success', async () => {
    const { systemUnderTest } = sutFactory()
    const account = await systemUnderTest.load('any_token', 'any_role')
    expect(account).toEqual(mockAccountModel())
  })

  test('Should throw if Decrypter throws', async () => {
    const { systemUnderTest, decrypterStub } = sutFactory()
    jest.spyOn(decrypterStub, 'decrypt').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })

  test('Should throw if LoadAccountByTokenRepository throws', async () => {
    const { systemUnderTest, loadAccountByTokenRepositoryStub } = sutFactory()
    jest.spyOn(loadAccountByTokenRepositoryStub, 'loadByToken').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.load('any_token', 'any_role')
    await expect(promise).rejects.toThrow()
  })
})
