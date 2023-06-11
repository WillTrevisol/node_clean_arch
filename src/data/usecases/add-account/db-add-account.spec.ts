import { type AddAccountModel, type AccountModel, type Encrypter, type AddAccountRepository } from './db-add-account-protocols'
import { DbAddAccount } from './db-add-account'

const addAccountRepositoryFactory = (): AddAccountRepository => {
  class AddAccountRepositoryStub implements AddAccountRepository {
    async add (accountData: AddAccountModel): Promise<AccountModel> {
      const fakeAccount = {
        id: 'valid_id',
        name: 'valid_name',
        email: 'valid_email',
        password: 'hashed_value'
      }
      return Promise.resolve(fakeAccount)
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
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await systemUnderTest.add(accountData)
    expect(encrypSpy).toHaveBeenCalledWith('valid_password')
  })

  test('Should throw if Encrypter throws', async () => {
    const { systemUnderTest, encrypterStub } = sutFactory()
    jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = systemUnderTest.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should add AddAccountRepository with correct values', async () => {
    const { systemUnderTest, addAccountRepositoryStub } = sutFactory()
    const addSpy = jest.spyOn(addAccountRepositoryStub, 'add')
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    await systemUnderTest.add(accountData)
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
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const promise = systemUnderTest.add(accountData)
    await expect(promise).rejects.toThrow()
  })

  test('Should return an account on sucess', async () => {
    const { systemUnderTest } = sutFactory()
    const accountData = {
      name: 'valid_name',
      email: 'valid_email',
      password: 'valid_password'
    }
    const account = await systemUnderTest.add(accountData)
    expect(account).toEqual({
      id: 'valid_id',
      name: 'valid_name',
      email: 'valid_email',
      password: 'hashed_value'
    })
  })
})
