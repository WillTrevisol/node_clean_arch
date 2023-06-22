import { type AddAccountModel, type AccountModel, type Hasher, type AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const addAccountRepositoryFactory = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(fakeAccountFactory())
    }
  }

  return new AddAccountRepositoryStub()
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
  email: 'valid_email',
  password: 'hashed_value'
})

const fakeAddAccountFactory = (): AddAccountModel => ({
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

interface sutTypes {
  systemUnderTest: DbAddAccount
  hasherStub: Hasher
  addAccountRepositoryStub: AddAccountRepository
}

const sutFactory = (): sutTypes => {
  const hasherStub = hasherFactory()
  const addAccountRepositoryStub = addAccountRepositoryFactory()
  const systemUnderTest = new DbAddAccount(hasherStub, addAccountRepositoryStub)

  return {
    systemUnderTest,
    addAccountRepositoryStub,
    hasherStub
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
      email: 'valid_email',
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
})
