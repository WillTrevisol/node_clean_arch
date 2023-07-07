export interface AddAccount {
  add: (account: AddAccountModel) => Promise<any>
}

export type AddAccountModel = {
  name: string
  email: string
  password: string
}
