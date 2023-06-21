import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
import { type Encrypter } from '../../../data/protocols/criptography/encrypter'

jest.mock('jsonwebtoken', () => ({
  sign: (): string => {
    return 'any_token'
  }
})
)

interface SutTypes {
  systemUnderTest: Encrypter
}

const sutFactory = (): SutTypes => {
  const systemUnderTest = new JwtAdapter('secret')

  return {
    systemUnderTest
  }
}

describe('Jwt Adapter', () => {
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
