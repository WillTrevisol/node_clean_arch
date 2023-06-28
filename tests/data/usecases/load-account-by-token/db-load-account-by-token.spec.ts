import { type Decrypter } from '../../../../src/data/protocols/criptography/decrypter'
import { DbLoadAccountByToken } from '../../../../src/data/usecases/load-account-by-token/db-load-account-by-token'

describe('DbLoadAccountByToken UseCase', () => {
  test('Shoul call Decrypter with correct values', async () => {
    class DecrypterStub implements Decrypter {
      async decrypt (value: string): Promise<string> {
        return Promise.resolve('any_value')
      }
    }
    const decrypterStub = new DecrypterStub()
    const decryptSpy = jest.spyOn(decrypterStub, 'decrypt')
    const systemUnderTest = new DbLoadAccountByToken(decrypterStub)
    await systemUnderTest.load('any_token')
    expect(decryptSpy).toBeCalledWith('any_token')
  })
})