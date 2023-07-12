import schemas from '@/main/docs/schemas'
import components from '@/main/docs/components'
import paths from '@/main/docs/paths'

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
  tags: [{
    name: 'Login'
  }, {
    name: 'Enquete'
  }],
  paths,
  schemas,
  components
}
