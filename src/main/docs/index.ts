import { badRequest, notFound, serverError, unauthorized } from '@/main/docs/components'
import { accountSchema, errorSchema, loginParamsSchema } from '@/main/docs/schemas'
import { loginPath } from '@/main/docs/paths'

export default {
  openapi: '3.0.0',
  info: {
    title: 'Node Clean Arch',
    description: 'API feita no curso do Manguinho, para realizar enquetes entre programadores\n Aluno: Willian Trevisol',
    version: '1.6.1'
  },
  lisence: {
    name: 'ISC',
    url: 'https://opensource.org/license/isc-license-txt/'
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
    loginParams: loginParamsSchema,
    error: errorSchema
  },
  components: {
    badRequest,
    unauthorized,
    serverError,
    notFound
  }
}
