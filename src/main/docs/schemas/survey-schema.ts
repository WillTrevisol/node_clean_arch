export const surveySchema = {
  properties: {
    id: {
      type: 'string'
    },
    question: {
      type: 'string'
    },
    answers: {
      type: 'array',
      items: {
        $ref: '#/schemas/surveyAnswer'
      }
    },
    date: {
      type: 'string'
    }
  }
}
