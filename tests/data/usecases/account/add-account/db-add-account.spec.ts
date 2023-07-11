import { type Hasher, type AddAccountRepository, type LoadAccountByEmailRepository, type AccountModel } from '@/data/usecases/account/add-account/db-add-account-protocols'
import { DbAddAccount } from '@/data/usecases/account/add-account/db-add-account'
import { mockAccountModel, mockAddAccountParams } from '@/tests/domain/mocks'
import { mockHasher, mockAccountRepository } from '@/tests/data/mocks'

const loadAccountByEmailRepositoryFactory = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<AccountModel | null> {
      return Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

type sutTypes = {
  systemUnderTest: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const sutFactory = (): sutTypes => {
  const hasherStub = mockHasher()
  const addAccountRepositoryStub = mockAccountRepository()
  const loadAccountByEmailRepositoryStub = loadAccountByEmailRepositoryFactory()
  const systemUnderTest = new DbAddAccount(hasherStub, addAccountRepositoryStub, loadAccountByEmailRepositoryStub)

  return {
    systemUnderTest,
    addAccountRepositoryStub,
    hasherStub,
    loadAccountByEmailRepositoryStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Hasher with correct password', async () => {
    const { systemUnderTest, hasherStub } = sutFactory()
    const hashpSpy = jest.spyOn(hasherStub, 'hash')
    await systemUnderTest.add(mockAddAccountParams())
    expect(hashpSpy).toHaveBeenCalledWith('any_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { systemUnderTest, hasherStub } = sutFactory()
    jest.spyOn(hasherStub, 'hash').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should add AddAccountRepository with correct values', async () => {
    const { systemUnderTest, addAccountRepositoryStub } = sutFactory()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await systemUnderTest.add(mockAddAccountParams())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'hashed_value'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { systemUnderTest, addAccountRepositoryStub } = sutFactory()
    jest.spyOn(addAccountRepositoryStub, 'add').mockRejectedValueOnce(new Error())
    const promise = systemUnderTest.add(mockAddAccountParams())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on sucess', async () => {
    const { systemUnderTest } = sutFactory()
    const account = await systemUnderTest.add(mockAddAccountParams())
    expect(account).toEqual(mockAccountModel())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(mockAccountModel())
    )
    const account = await systemUnderTest.add(mockAddAccountParams())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await systemUnderTest.add(mockAddAccountParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })
})
