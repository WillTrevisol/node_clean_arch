import { DbAuthentication } from '@/data/usecases/account/authentication/db-authentication'
import {
  type Authentication,
  type LoadAccountByEmailRepository,
  type UpdateAccessTokenRepository,
  type Encrypter,
  type HashCompare
} from '@/data/usecases/account/authentication/db-authentication-protocols'
import { mockLoadAccountByEmailRepository, mockEncrypter, mockHashCompare, mockUpdateAccessTokenRepository } from '@/tests/data/mocks'
import { mockAuthenticationParams } from '@/tests/domain/mocks'

type SutTypes = {
  systemUnderTest: Authentication
  loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository
  hashCompareStub: HashCompare
  encrypterStub: Encrypter
  updateAccessTokenRepositoryStub: UpdateAccessTokenRepository
}

const sutFactory = (): SutTypes => {
  const loadAccountByEmailRepositoryStub = mockLoadAccountByEmailRepository()
  const hashCompareStub = mockHashCompare()
  const encrypterStub = mockEncrypter()
  const updateAccessTokenRepositoryStub = mockUpdateAccessTokenRepository()
  const systemUnderTest = new DbAuthentication(
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  )

  return {
    systemUnderTest,
    loadAccountByEmailRepositoryStub,
    hashCompareStub,
    encrypterStub,
    updateAccessTokenRepositoryStub
  }
}

describe('DbAuthentication UseCase', () => {
  test('Should call LoadAccountByEmailRepository with correct email', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
    await systemUnderTest.auth(mockAuthenticationParams())
    expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should throw if LoadAccountByEmailRepository throws', async () => {
    const { systemUnderTest, loadAccountByEmailRepositoryStub } = sutFactory()
    jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.auth(mockAuthenticationParams())
    await expect(result).rejects.toThrow()
  })

  test('Should call HashCompare with correct password', async () => {
    const { systemUnderTest, hashCompareStub } = sutFactory()
    const compareSpy = jest.spyOn(hashCompareStub, 'compare')
    await systemUnderTest.auth(mockAuthenticationParams())
    expect(compareSpy).toHaveBeenCalledWith('any_password', 'any_password')
  })

  test('Should return null if HashCompare returns false', async () => {
    const { systemUnderTest, hashCompareStub } = sutFactory()
    jest.spyOn(hashCompareStub, 'compare').mockResolvedValueOnce(false)
    const accessToken = await systemUnderTest.auth(mockAuthenticationParams())
    expect(accessToken).toBeFalsy()
  })

  test('Should call  with correct id', async () => {
    const { systemUnderTest, encrypterStub } = sutFactory()
    const generateSpy = jest.spyOn(encrypterStub, 'encrypt')
    await systemUnderTest.auth(mockAuthenticationParams())
    expect(generateSpy).toHaveBeenCalledWith('any_id')
  })

  test('Should throw if Encrypter throws', async () => {
    const { systemUnderTest, encrypterStub } = sutFactory()
    jest.spyOn(encrypterStub, 'encrypt').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.auth(mockAuthenticationParams())
    await expect(result).rejects.toThrow()
  })

  test('Should return AccessToken on success', async () => {
    const { systemUnderTest } = sutFactory()
    const accessToken = await systemUnderTest.auth(mockAuthenticationParams())
    expect(accessToken).toBe('any_token')
  })

  test('Should call UpdateAccessTokenRepository with correct values', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = sutFactory()
    const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
    await systemUnderTest.auth(mockAuthenticationParams())
    expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token')
  })

  test('Should throw if UpdateAccessTokenRepository throws', async () => {
    const { systemUnderTest, updateAccessTokenRepositoryStub } = sutFactory()
    jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken').mockRejectedValueOnce(new Error())
    const result = systemUnderTest.auth(mockAuthenticationParams())
    await expect(result).rejects.toThrow()
  })
})
