import { type AccountModel } from '@/domain/models'

export interface AddAccount {
  add: (account: AddAccountParams) => Promise<any>
}

export type AddAccountParams = Omit<AccountModel, 'id'>
