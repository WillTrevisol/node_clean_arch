export const surveyResultAnswerSchema = {
  properties: {
    image: {
      type: 'string'
    },
    answer: {
      type: 'string'
    },
    count: {
      type: 'number'
    },
    percent: {
      type: 'number'
    }
  },
  required: ['answer', 'count', 'percent']
}
