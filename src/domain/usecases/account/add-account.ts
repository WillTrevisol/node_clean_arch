import { type AccountModel } from '@/domain/models'

export interface AddAccount {
  add: (account: AddAccounParams) => Promise<any>
}

export type AddAccounParams = Omit<AccountModel, 'id'>
