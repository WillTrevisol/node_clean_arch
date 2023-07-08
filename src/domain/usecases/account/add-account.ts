import { type AccountModel } from '@/domain/models'

export interface AddAccount {
  add: (account: AddAccountModel) => Promise<any>
}

export type AddAccountModel = Omit<AccountModel, 'id'>
