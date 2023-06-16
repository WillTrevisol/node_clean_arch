import { EmailValidation } from './email-validation'
import { type EmailValidator } from '../../controllers/signup/signup-protocols'
import { InvalidParameterError } from '../../errors'

const emailValidatorFactory = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    isValid (email: string): boolean {
      return true
    }
  }

  return new EmailValidatorStub()
}

interface SutTypes {
  systemUnderTest: EmailValidation
  emailValidatorStub: EmailValidator
}

const sutFactory = (): SutTypes => {
  const emailValidatorStub = emailValidatorFactory()
  const systemUnderTest = new EmailValidation(emailValidatorStub, 'email')

  return {
    systemUnderTest,
    emailValidatorStub
  }
}

describe('Email Validation', () => {
  test('Should return an error if EmailValidator returns false', () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = systemUnderTest.validate({ email: 'any_email@mail.com' })
    expect(error).toEqual(new InvalidParameterError('email'))
  })

  test('Should call EmailValidator with correct email', () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid')
    systemUnderTest.validate({ email: 'any_email@mail.com' })
    expect(isValidSpy).toHaveBeenCalledWith('any_email@mail.com')
  })

  test('Should return throw if EmailValidator throws', () => {
    const { systemUnderTest, emailValidatorStub } = sutFactory()
    jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
      throw new Error()
    })
    expect(systemUnderTest.validate).toThrow()
  })
})
