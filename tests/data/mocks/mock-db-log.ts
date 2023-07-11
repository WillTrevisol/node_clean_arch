import { type LogErrorRepository } from '@/data/protocols/db/log/log-error-repository'

export const mockLogErrorRepository = (): LogErrorRepository => {
  class LogErrorRepositoryStub implements LogErrorRepository {
    async logError (stackTrace: string): Promise<void> {
    }
  }
  return new LogErrorRepositoryStub()
}
