import { type HttpRequest, type EmailValidator, type Authentication } from '../signup/signup-protocols'
import { InvalidParameterError, MissingParameterError, ServerError } from '../../errors'
import { ok, badRequest, serverError, unauthorized } from '../../helpers/http-helper'
import { LoginController } from './login'

const authenticationStubFactory = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (email: string, password: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const emailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }
  return new EmailValidatorStub()
}

const fakeHttpRequestFactory = (): HttpRequest => ({
  body: {
    email: 'any_email@mail.com',
    password: 'any_password'
  }
})

interface SutTypes {
  systemUnderTest: LoginController
  emailValidatorStub: EmailValidator
  authenticationStub: Authentication
}

const sutFactory = (): SutTypes => {
  const emailValidatorStub = emailValidatorFactory()
  const authenticationStub = authenticationStubFactory()
  const systemUnderTest = new LoginController(emailValidatorStub, authenticationStub)

  return {
    systemUnderTest,
    emailValidatorStub,
    authenticationStub
  }
}

describe('Login Controller', () => {
  test('Should return 400 if no email is provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpRequest = {
      body: {
        password: 'any_password'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParameterError('email')))
  })

  test('Should return 400 if no password is provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpRequest = {
      body: {
        email: 'any_email@mail.com'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new MissingParameterError('password')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpResponse = await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(httpResponse).toEqual(badRequest(new InvalidParameterError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(isValidSpy).toBeCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(
      () => { throw new Error() }
    )
    const httpResponse = await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  test('Should call Authentication with correct values', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await systemUnderTest.handle(fakeHttpRequestFactory())
    expect(authSpy).toBeCalledWith('any_email@mail.com', 'any_password')
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
})
