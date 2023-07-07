import { type HttpRequest, type LoadAccountByToken, type AccountModel } from '@/presentation/middlewares/auth-middleware-protocols'
import { ok, forbidden, serverError } from '@/presentation/helpers/http/http-helper'
import { AuthMiddleware } from '@/presentation/middlewares/auth-middleware'
import { AccessDeniedError } from '@/presentation/errors'

const fakeAccountFactory = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email@mail.com',
  password: 'hashed_value'
})

const fakeHttpRequest = (): HttpRequest => ({
  headers: {
    'x-access-token': 'any_token'
  }
})

const loadAccountByTokenStubFactory = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel | null> {
      return Promise.resolve(fakeAccountFactory())
    }
  }
  return new LoadAccountByTokenStub()
}

interface SutTypes {
  systemUnderTest: AuthMiddleware
  loadAccountByTokenStub: LoadAccountByToken
}

const sutFactory = (role?: string): SutTypes => {
  const loadAccountByTokenStub = loadAccountByTokenStubFactory()
  const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub, role)

  return {
    systemUnderTest,
    loadAccountByTokenStub
  }
}

describe('AuthMiddleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should call LoadAccountByToken with correct correct values', async () => {
    const role = 'any_role'
    const { systemUnderTest, loadAccountByTokenStub } = sutFactory(role)
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await systemUnderTest.handle(fakeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token', role)
  })

  test('Should return 403 if LoadAccountByToken returns null', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = sutFactory()
    jest.spyOn(loadAccountByTokenStub, 'load').mockResolvedValueOnce(null)
    const httpResponse = await systemUnderTest.handle(fakeHttpRequest())
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })

  test('Should return 200 if LoadAccountByToken returns an account', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(fakeHttpRequest())
    expect(httpResponse).toEqual(ok({ accountId: 'valid_id' }))
  })

  test('Should return 500 if LoadAccountByToken throws', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = sutFactory()
    jest.spyOn(loadAccountByTokenStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(fakeHttpRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
