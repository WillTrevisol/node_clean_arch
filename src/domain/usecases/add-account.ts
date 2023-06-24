export interface AddAccount {
  add: (account: AddAccountModel) => Promise<any>
}

export interface AddAccountModel {
  name: string
  email: string
  password: string
}
