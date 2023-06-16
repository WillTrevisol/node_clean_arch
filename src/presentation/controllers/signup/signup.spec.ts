import { SignUpController } from './signup'
import { MissingParameterError, ServerError } from '../../errors'
import { type AddAccount, type AddAccountModel, type AccountModel, type HttpRequest, type Validation } from './signup-protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

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
}

const sutFactory = (): SutTypes => {
  const addAccountStub = addAccountFactory()
  const validationStub = validationStubFactory()
  const systemUnderTest = new SignUpController(addAccountStub, validationStub)

  return {
    systemUnderTest,
    addAccountStub,
    validationStub
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

  test('Should return 200 if valid data is provided', async () => {
    const { systemUnderTest } = sutFactory()
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(ok(fakeAccountFactory()))
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
})
