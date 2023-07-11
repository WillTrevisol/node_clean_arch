import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { MissingParameterError, ServerError } from '@/presentation/errors'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import {
  type AddAccount,
  type HttpRequest,
  type Validation,
  type Authentication
} from '@/presentation/controllers/login/signup/signup-controller-protocols'
import { mockAddAccount, mockAuthentication, mockValidation } from '@/tests/presentation/mocks'

const mockHttpRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  systemUnderTest: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const sutFactory = (): SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const systemUnderTest = new SignUpController(addAccountStub, validationStub, authenticationStub)

  return {
    systemUnderTest,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Should call AddAccount with correct values', async () => {
    const { systemUnderTest, addAccountStub } = sutFactory()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await systemUnderTest.handle(mockHttpRequest())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { systemUnderTest, addAccountStub } = sutFactory()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return Promise.reject(new Error())
    })
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { systemUnderTest, addAccountStub } = sutFactory()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockHttpRequest()
    await systemUnderTest.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns error', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParameterError('any_field'))
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParameterError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await systemUnderTest.handle(mockHttpRequest())
    expect(authSpy).toBeCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    jest.spyOn(authenticationStub, 'auth').mockRejectedValueOnce(new Error())
    const httpResponse = await systemUnderTest.handle(mockHttpRequest())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })
})
