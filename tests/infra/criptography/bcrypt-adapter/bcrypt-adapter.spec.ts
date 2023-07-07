import { BcryptAdapter } from '@/infra/criptography/bcrypt-adapter/bcrypt-adapter'
import bcrypt from 'bcrypt'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return Promise.resolve('hash')
  },

  async compare (): Promise<boolean> {
    return Promise.resolve(true)
  }
}))

const salt = 12
const sutFactory = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  describe('hash()', () => {
    test('Should call hash with correct values', async () => {
      const systemUnderTest = sutFactory()
      const hashSpy = jest.spyOn(bcrypt, 'hash')
      await systemUnderTest.hash('any_value')
      expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
    })

    test('Should return a validHash on hash success', async () => {
      const systemUnderTest = sutFactory()
      const hash = await systemUnderTest.hash('any_value')
      expect(hash).toBe('hash')
    })

    test('Should throw if hash throws', async () => {
      const systemUnderTest = sutFactory()
      jest.spyOn(bcrypt, 'hash').mockImplementationOnce(() => { throw new Error() })
      const promise = systemUnderTest.hash('any_value')
      await expect(promise).rejects.toThrow()
    })
  })

  describe('compare()', () => {
    test('Should call compare with correct values', async () => {
      const systemUnderTest = sutFactory()
      const compareSpy = jest.spyOn(bcrypt, 'compare')
      await systemUnderTest.compare('any_value', 'any_hash')
      expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
    })

    test('Should return true when compare succeeds', async () => {
      const systemUnderTest = sutFactory()
      const isValid = await systemUnderTest.compare('any_value', 'any_hash')
      expect(isValid).toBe(true)
    })

    test('Should return false if compare fails', async () => {
      const systemUnderTest = sutFactory()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => false)
      const isValid = await systemUnderTest.compare('any_value', 'any_hash')
      expect(isValid).toBe(false)
    })

    test('Should throw if compare throws', async () => {
      const systemUnderTest = sutFactory()
      jest.spyOn(bcrypt, 'compare').mockImplementationOnce(() => { throw new Error() })
      const promise = systemUnderTest.compare('any_value', 'any_hash')
      await expect(promise).rejects.toThrow()
    })
  })
})
