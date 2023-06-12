import { type HttpRequest, type Controller } from '../../presentation/protocols'
import { type Request, type Response } from 'express'

export const routeAdapter = (controller: Controller): any => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse = await controller.handle(httpRequest)
    res.status(httpResponse.statusCode).json(httpResponse.body)
  }
}
