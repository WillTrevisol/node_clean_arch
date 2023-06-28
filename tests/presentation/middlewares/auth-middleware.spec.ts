import { HttpRequest } from '../../../src/presentation/protocols/http'
import { ok, forbidden } from '../../../src/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '../../../src/presentation/errors'
import { AuthMiddleware } from '../../../src/presentation/middlewares/auth-middleware'
import { LoadAccountByToken } from '../../../src/domain/usecases/load-account-by-token'
import { AccountModel } from '../../../src/domain/models'

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

const sutFactory = (): SutTypes => {
  const loadAccountByTokenStub = loadAccountByTokenStubFactory()
  const systemUnderTest = new AuthMiddleware(loadAccountByTokenStub)

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

  test('Should call LoadAccountByToken with correct accessToken', async () => {
    const { systemUnderTest, loadAccountByTokenStub } = sutFactory()
    const loadSpy = jest.spyOn(loadAccountByTokenStub, 'load')
    await systemUnderTest.handle(fakeHttpRequest())
    expect(loadSpy).toHaveBeenCalledWith('any_token')
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
})
