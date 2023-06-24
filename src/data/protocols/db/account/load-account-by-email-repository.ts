export interface LoadAccountByEmailRepository {
  loadByEmail: (email: string) => Promise<any>
}
