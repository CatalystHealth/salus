import { Schema } from './types/schema'

export interface ContextEntry {
  key: string
  schema: Schema<unknown>
}

export class Context {
  constructor(public readonly entries: ContextEntry[]) {}

  public get current(): ContextEntry {
    return this.entries[this.entries.length - 1]
  }

  public enter(key: string, schema: Schema<unknown>): Context {
    return new Context([
      ...this.entries,
      {
        key,
        schema
      }
    ])
  }

  public static create(from: Schema<unknown>): Context {
    return new Context([
      {
        key: '',
        schema: from
      }
    ])
  }
}
