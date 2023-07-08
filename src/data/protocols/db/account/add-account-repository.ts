import { type AddAccountModel } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<any>
}
