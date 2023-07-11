import { type SaveSurveyResultParams, type SurveyResultModel, type SaveSurveyResultRepository } from './db-save-survey-result-protocols'

export class DbSaveSurveyResult implements SaveSurveyResultRepository {
  constructor (private readonly saveSurveyResultRepository: SaveSurveyResultRepository) {}

  async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
    const surveyResultModel = await this.saveSurveyResultRepository.save(data)
    return surveyResultModel
  }
}
