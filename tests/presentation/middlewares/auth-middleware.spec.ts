import { HttpRequest } from '../../../src/presentation/protocols/http'
import { forbidden } from '../../../src/presentation/helpers/http/http-helper'
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

const loadAccountByTokenStubFactory = (): LoadAccountByToken => {
  class LoadAccountByTokenStub implements LoadAccountByToken {
    async load (accessToken: string, role?: string): Promise<AccountModel> {
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
    await systemUnderTest.handle({
      headers: {
        'x-access-token': 'any_token'
      }
    })
    expect(loadSpy).toHaveBeenCalledWith('any_token')
  })
})
