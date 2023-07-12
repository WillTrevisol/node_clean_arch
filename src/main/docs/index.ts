import { loginPath } from './paths/login-path'
import { loginParamsSchema } from './schemas'
import { accountSchema } from './schemas/account-schema'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Node Clean Arch',
    description: 'API feita no curso do Manguinho, para realizar enquetes entre programadores\n Aluno: Willian Trevisol',
    version: '1.6.1'
  },
  servers: [
    {
      url: '/api'
    }
  ],
  tags: [
    {
      name: 'Login'
    }
  ],
  paths: {
    '/login': loginPath
  },
  schemas: {
    account: accountSchema,
    loginParams: loginParamsSchema
  }
}
