import { type HttpRequest, type Authentication, type Validation, type AuthenticationModel } from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { ok, badRequest, serverError, unauthorized } from '@/presentation/helpers/http/http-helper'
import { LoginController } from '@/presentation/controllers/login/login/login-controller'
import { MissingParameterError, ServerError } from '@/presentation/errors'

const authenticationStubFactory = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const validationStubFactory = (): Validation => {
  class ValidationSub implements Validation {
    validate (data: any): any {
      return null
    }
  }

  return new ValidationSub()
}

const fakeHttpRequestFactory = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  systemUnderTest: LoginController
  authenticationStub: Authentication
  validationStub: Validation
}

const sutFactory = (): SutTypes => {
  const authenticationStub = authenticationStubFactory()
  const validationStub = validationStubFactory()
  const systemUnderTest = new LoginController(validationStub, authenticationStub)

  return {
    systemUnderTest,
    authenticationStub,
    validationStub
  }
}

describe('Login Controller', () => {
  test('Should call Authentication with correct values', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(authSpy).toBeCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 401 if invalid credentials are provided', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      Promise.resolve('')
    )
    const httpResponse = await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(httpResponse).toEqual(unauthorized())
  })

  test('Should return 500 if Authentication throws', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  test('Should return 200 if valid credentials are provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = fakeHttpRequestFactory()
    await systemUnderTest.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns error', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParameterError('any_field'))
    const httpResponse = await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(httpResponse).toEqual(badRequest(new MissingParameterError('any_field')))
  })
})
