import { HttpRequest } from '../../../src/presentation/protocols/http'
import { forbidden } from '../../../src/presentation/helpers/http/http-helper'
import { AccessDeniedError } from '../../../src/presentation/errors'
import { AuthMiddleware } from '../../../src/presentation/middlewares/auth-middleware'

describe('AuthMiddleware', () => {
  test('Should return 403 if no x-access-token exists in headers', async () => {
    const systemUnderTest = new AuthMiddleware()
    const httpResponse = await systemUnderTest.handle({})
    expect(httpResponse).toEqual(forbidden(new AccessDeniedError()))
  })
})
