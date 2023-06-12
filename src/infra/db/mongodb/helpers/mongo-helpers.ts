import { type Collection, MongoClient } from 'mongodb'

export const MongoHelper = {
  mongoClient: undefined as unknown as MongoClient,

  async connect (uri: string): Promise<void> {
    this.mongoClient = await MongoClient.connect(
      uri, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      }
    )
  },

  async disconnect (): Promise<void> {
    await this.mongoClient.close()
  },

  getColletion (name: string): Collection {
    return this.mongoClient.db().collection(name)
  },

  map: (document: any): any => {
    const { _id, ...documentWithoutId } = document
    return Object.assign({}, documentWithoutId, { id: _id })
  }
}
