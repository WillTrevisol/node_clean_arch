import { SignUpController } from './signup'
import { MissingParameterError, InvalidParameterError, ServerError } from '../../errors'
import { type EmailValidator, type AddAccount, type AddAccountModel, type AccountModel, type HttpRequest, type Validation } from './signup-protocols'
import { ok, serverError, badRequest } from '../../helpers/http-helper'

const emailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
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
  emailValidatorStub: EmailValidator
  addAccountStub: AddAccount
  validationStub: Validation
}

const sutFactory = (): SutTypes => {
  const emailValidatorStub = emailValidatorFactory()
  const addAccountStub = addAccountFactory()
  const validationStub = validationStubFactory()
  const systemUnderTest = new SignUpController(emailValidatorStub, addAccountStub, validationStub)

  return {
    systemUnderTest,
    emailValidatorStub,
    addAccountStub,
    validationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 400 if password confirmation fails', async () => {
    const { systemUnderTest } = sutFactory()
    const httpRequest = {
      body: {
        name: 'any_name',
        email: 'any_email@mail.com',
        password: 'any_password',
        passwordConfirmation: 'invalid_password'
      }
    }
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParameterError('passwordConfirmation')))
  })

  test('Should return 400 if an invalid email is provided', async () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const httpRequest = httpRequestFactory()
    const httpResponse = await systemUnderTest.handle(httpRequest)
    expect(httpResponse).toEqual(badRequest(new InvalidParameterError('email')))
  })

  test('Should call EmailValidator with correct email', async () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    await systemUnderTest.handle(httpRequestFactory())

    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return 500 if EmailValidator throws', async () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    const httpResponse = await systemUnderTest.handle(httpRequestFactory())
    expect(httpResponse).toEqual(serverError(new ServerError('any_stack')))
  })

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
