import { apiKeyAuthShema } from '@/main/docs/schemas/'
import { badRequest, forbidden, notFound, serverError, unauthorized } from '@/main/docs/components/'

export default {
  securitySchemes: {
    apiKeyAuth: apiKeyAuthShema
  },
  badRequest,
  unauthorized,
  serverError,
  notFound,
  forbidden
}
