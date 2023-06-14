import { type AddAccountModel, type AccountModel, type Encrypter, type AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const addAccountRepositoryFactory = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(fakeAccountFactory())
    }
  }

  return new AddAccountRepositoryStub()
}

const encrypterFactory = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }

  return new EncrypterStub()
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
  encrypterStub: Encrypter
  addAccountRepositoryStub: AddAccountRepository
}

const sutFactory = (): sutTypes => {
  const encrypterStub = encrypterFactory()
  const addAccountRepositoryStub = addAccountRepositoryFactory()
  const systemUnderTest = new DbAddAccount(encrypterStub, addAccountRepositoryStub)

  return {
    systemUnderTest,
    addAccountRepositoryStub,
    encrypterStub
  }
}

describe('DbAddAccount Usecase', () => {
  test('Should call Encrypter with correct password', async () => {
    const { systemUnderTest, encrypterStub } = sutFactory()
    const encrypSpy = jest.spyOn(encrypterStub, 'encrypt')
    await systemUnderTest.add(fakeAddAccountFactory())
    expect(encrypSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { systemUnderTest, encrypterStub } = sutFactory()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
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
