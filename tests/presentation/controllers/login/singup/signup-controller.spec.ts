import { ok, serverError, badRequest, forbidden } from '@/presentation/helpers/http/http-helper'
import { SignUpController } from '@/presentation/controllers/login/signup/signup-controller'
import { MissingParameterError, ServerError } from '@/presentation/errors'
import { EmailInUseError } from '@/presentation/errors/email-in-use-error'
import {
  type AddAccount,
  type AddAccountModel,
  type AccountModel,
  type HttpRequest,
  type Validation,
  type Authentication,
  type AuthenticationModel
} from '@/presentation/controllers/login/signup/signup-controller-protocols'

const authenticationStubFactory = (): Authentication => {
  class AuthenticationStub implements Authentication {
    async auth (authentication: AuthenticationModel): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new AuthenticationStub()
}

const addAccountFactory = (): AddAccount => {
  class AddAccountStub implements AddAccount {
    async add (account: AddAccountModel): Promise<AccountModel> {
      return Promise.resolve(fakeAccountFactory())
    }
  }

  return new AddAccountStub()
}

const validationStubFactory = (): Validation => {
  class ValidationSub implements Validation {
    validate (data: any): any {
      return null
    }
  }

  return new ValidationSub()
}

const httpRequestFactory = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

const fakeAccountFactory = (): AccountModel => ({
  id: 'valid_id',
  name: 'valid_name',
  email: 'valid_email',
  password: 'valid_password'
})

interface SutTypes {
  systemUnderTest: SignUpController
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const sutFactory = (): SutTypes => {
  const addAccountStub = addAccountFactory()
  const validationStub = validationStubFactory()
  const authenticationStub = authenticationStubFactory()
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
    await systemUnderTest.handle(httpRequestFactory())
    expect(addSpy).toHaveBeenCalledWith({
      name: 'any_name',
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if AddAccount throws', async () => {
    const { systemUnderTest, addAccountStub } = sutFactory()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(async () => {
      return new Promise((resolve, reject) => { reject(new Error()) })
    })
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { systemUnderTest, addAccountStub } = sutFactory()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(
      Promise.resolve(null)
    )
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 if valid data is provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct value', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = httpRequestFactory()
    await systemUnderTest.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if Validation returns error', async () => {
    const { systemUnderTest, validationStub } = sutFactory()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParameterError('any_field'))
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(badRequest(new MissingParameterError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await systemUnderTest.handle(httpRequestFactory())
    expect(authSpy).toBeCalledWith({
      email: 'any_email@mail.com',
      password: 'any_password'
    })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { systemUnderTest, authenticationStub } = sutFactory()
    jest.spyOn(authenticationStub, 'auth').mockReturnValueOnce(
      Promise.reject(new Error())
    )
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })
})
