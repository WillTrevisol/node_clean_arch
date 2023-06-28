import { type Decrypter } from '../../../../src/data/protocols/criptography/decrypter'
import { DbLoadAccountByToken } from '../../../../src/data/usecases/load-account-by-token/db-load-account-by-token'

const decrypterStubFactory = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  systemUnderTest: DbLoadAccountByToken
  decrypterStub: Decrypter
}

const sutFactory = (): SutTypes => {
  const decrypterStub = decrypterStubFactory()
  const systemUnderTest = new DbLoadAccountByToken(decrypterStub)

  return {
    systemUnderTest,
    decrypterStub
  }
}

describe('DbLoadAccountByToken UseCase', () => {
  test('Shoul call Decrypter with correct values', async () => {
    const { systemUnderTest, decrypterStub } = sutFactory()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    await systemUnderTest.load('any_token')
    expect(decryptSpy).toBeCalledWith('any_token')
  })
})