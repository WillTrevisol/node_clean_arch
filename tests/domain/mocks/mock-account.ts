import { type AccountModel } from '@/domain/models'
import { type AuthenticationParams, type AddAccounParams } from '@/domain/usecases'

export const mockAddAccountParams = (): AddAccounParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})

export const mockAccountModel = (): AccountModel => Object.assign({}, mockAddAccountParams(), ({ id: 'any_id' }))

export const mockAuthenticationParams = (): AuthenticationParams => ({
  email: 'any_email@mail.com',
  password: 'any_password'
})
