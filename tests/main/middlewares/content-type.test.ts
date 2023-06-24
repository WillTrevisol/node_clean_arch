import request from 'supertest'
import app from '../../../src/main/config/app'

describe('Content-Type Middleware', () => {
  test('Should return default content-type as Json', async () => {
    app.get('/test_content_type', (req, res) => {
      res.send()
    })
    await request(app)
      .get('/test_content_type')
      .expect('content-type', /json/)
  })

  test('Should return XML content-type when forced', async () => {
    app.get('/test_html_content_type', (req, res) => {
      res.type('html')
      res.send()
    })
    await request(app)
      .get('/test_html_content_type')
      .expect('content-type', /html/)
  })
})
