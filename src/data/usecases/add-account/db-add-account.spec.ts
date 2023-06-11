import { type Encrypter } from '../../protocols/encrypter'
import { DbAddAccount } from './db-add-account'

interface sutTypes {
  systemUnderTest: DbAddAccount
  encrypterStub: Encrypter
}

const encrypterFactory = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }

  return new EncrypterStub()
}

const sutFactory = (): sutTypes => {
  const encrypterStub = encrypterFactory()
  const systemUnderTest = new DbAddAccount(encrypterStub)

  return {
    systemUnderTest,
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
})
