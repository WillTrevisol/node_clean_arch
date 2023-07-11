import { type AccountModel } from '@/domain/models'
import { type AddAccounParams } from '@/domain/usecases'

export const mockAccountModel = (): AccountModel => ({
  id: 'any_id',
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'hashed_value'
})

export const mockAddAccountParams = (): AddAccounParams => ({
  name: 'any_name',
  email: 'any_email@mail.com',
  password: 'any_password'
})
