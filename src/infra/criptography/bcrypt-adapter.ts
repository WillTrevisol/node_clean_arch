import bcrypt from 'bcrypt'
import { type Hasher } from '../../data/protocols/criptography/hasher'

export class BcryptAdapter implements Hasher {
  private readonly salt: number

  constructor (salt: number) {
    this.salt = salt
  }

  async hash (value: string): Promise<string> {
    const encrypedString = await bcrypt.hash(value, this.salt)
    return encrypedString
  }
}
