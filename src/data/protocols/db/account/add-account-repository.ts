import { type AddAccountModel } from '../../../../domain/usecases/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccountModel) => Promise<any>
}
