import { type AddAccountModel, type AccountModel, type Hasher, type AddAccountRepository, type LoadAccountByEmailRepository } from '../../../../src/data/usecases/add-account/db-add-account-protocols'
import { DbAddAccount } from '../../../../src/data/usecases/add-account/db-add-account'

const addAccountRepositoryFactory = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(fakeAccountFactory())
    }
  }

  return new AddAccountRepositoryStub()
}

const loadAccountByEmailRepositoryFactory = (): LoadAccountByEmailRepository => {
  class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
    async loadByEmail (email: string): Promise<any> {
      return Promise.resolve(null)
    }
  }
  return new LoadAccountByEmailRepositoryStub()
}

const hasherFactory = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

const fakeAccountFactory = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value'
})

const fakeAddAccountFactory = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'valid_password'
})

interface sutTypes {
  systemUnderTest: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
}

const sutFactory = (): sutTypes => {
  const hasherStub = hasherFactory()
  const addAccountRepositoryStub = addAccountRepositoryFactory()
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
    await systemUnderTest.add(fakeAddAccountFactory())
    expect(hashpSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Hasher throws', async () => {
    const { systemUnderTest, hasherStub } = sutFactory()
    jest.spyOn(hasherStub, 'hash').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = systemUnderTest.add(fakeAddAccountFactory())
    await expect(promise).rejects.toThrow()
  })

  test('Should add AddAccountRepository with correct values', async () => {
    const { systemUnderTest, addAccountRepositoryStub } = sutFactory()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    await systemUnderTest.add(fakeAddAccountFactory())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'valid_name',
      email: 'valid_email@mail.com',
      password: 'hashed_value'
    })
  })

  test('Should throw if AddAccountRepository throws', async () => {
    const { systemUnderTest, addAccountRepositoryStub } = sutFactory()
    jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const promise = systemUnderTest.add(fakeAddAccountFactory())
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on sucess', async () => {
    const { systemUnderTest } = sutFactory()
    const account = await systemUnderTest.add(fakeAddAccountFactory())
    expect(account).toEqual(fakeAccountFactory())
  })

  test('Should return null if LoadAccountByEmailRepository not return null', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(
      Promise.resolve(fakeAccountFactory())
    )
    const account = await systemUnderTest.add(fakeAddAccountFactory())
    expect(account).toBeNull()
  })

  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await systemUnderTest.add(fakeAddAccountFactory())
    expect(loadSpy).toHaveBeenCalledWith('valid_email@mail.com')
  })
})
