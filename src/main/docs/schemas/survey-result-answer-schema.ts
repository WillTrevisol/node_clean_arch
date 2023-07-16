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
    percentage: {
      type: 'number'
    }
  },
  required: ['answer', 'count', 'percentage']
}
