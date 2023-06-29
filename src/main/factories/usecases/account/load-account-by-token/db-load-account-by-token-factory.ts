import { AccountMongoRepository } from '../../../../../infra/db/mongodb/account/account-mongo-repository'
import { type LoadAccountByToken } from '../../../../../domain/usecases'
import { DbLoadAccountByToken } from '../../../../../data/usecases/load-account-by-token/db-load-account-by-token'
import { JwtAdapter } from '../../../../../infra/criptography/jwt-adapter/jwt-adapter'
import env from '../../../../config/env'

export const dbLoadAccountByTokenFactory = (): LoadAccountByToken => {
  const jwtAdpter = new JwtAdapter(env.jwtSecret)
  const accountMongoRepository = new AccountMongoRepository()
  return new DbLoadAccountByToken(jwtAdpter, accountMongoRepository)
}
