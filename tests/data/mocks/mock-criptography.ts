import { type Hasher } from '@/data/protocols/criptography/hasher'
import { type Decrypter } from '@/data/protocols/criptography/decrypter'
import { type Encrypter } from '@/data/protocols/criptography/encrypter'
import { type HashCompare } from '@/data/protocols/criptography/hash-compare'

export const mockHasher = (): Hasher => {
  class HasherStub implements Hasher {
    async hash (value: string): Promise<string> {
      return Promise.resolve('hashed_value')
    }
  }

  return new HasherStub()
}

export const mockDecrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string | null> {
      return Promise.resolve('any_value')
    }
  }
  return new DecrypterStub()
}

export const mockEncrypter = (): Encrypter => {
  class EncrypterStub implements Encrypter {
    async encrypt (value: string): Promise<string> {
      return Promise.resolve('any_token')
    }
  }
  return new EncrypterStub()
}

export const mockHashCompare = (): HashCompare => {
  class HashCompareStub implements HashCompare {
    async compare (value: string, hash: string): Promise<boolean> {
      return Promise.resolve(true)
    }
  }
  return new HashCompareStub()
}
