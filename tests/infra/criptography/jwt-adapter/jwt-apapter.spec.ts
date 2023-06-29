import jwt from 'jsonwebtoken'
import { JwtAdapter } from '../../../../src/infra/criptography/jwt-adapter/jwt-adapter'
import { type Encrypter } from '../../../../src/data/protocols/criptography/encrypter'
import { verify } from 'crypto'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return 'any_token'
  },
  verify: (token: string): string => {
    return 'any_value'
  }
})
)

interface SutTypes {
  systemUnderTest: JwtAdapter
}

const sutFactory = (): SutTypes => {
  const systemUnderTest = new JwtAdapter('secret')

  return {
    systemUnderTest
  }
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const { systemUnderTest } = sutFactory()
      const signSpy = jest.spyOn(jwt, 'sign')
      await systemUnderTest.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })
  
    test('Should return a token o sing success', async () => {
      const { systemUnderTest } = sutFactory()
      const accessToken = await systemUnderTest.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })
  
    test('Should throw if sign throws', async () => {
      const { systemUnderTest } = sutFactory()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(
        () => { throw new Error() }
      )
      const promise = systemUnderTest.encrypt('any_id')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const { systemUnderTest } = sutFactory()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await systemUnderTest.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })
      
    test('Should return a value on verify success', async () => {
      const { systemUnderTest } = sutFactory()
      const value = await systemUnderTest.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if verify throws', async () => {
      const { systemUnderTest } = sutFactory()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(
        () => { throw new Error() }
      )
      const promise = systemUnderTest.decrypt('any_token')
      await expect(promise).rejects.toThrow()
    })
  })
})
