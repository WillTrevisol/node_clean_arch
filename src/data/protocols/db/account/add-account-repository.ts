import { type AddAccounParams } from '@/domain/usecases/account/add-account'

export interface AddAccountRepository {
  add: (accountData: AddAccounParams) => Promise<any>
}
