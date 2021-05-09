import { Context } from './context'
import { Schema } from './types/schema'
import { Validation } from './validation'

export function decode<A>(schema: Schema<A, any>, value: unknown): Validation<A> {
  return schema.decode(value, Context.create(schema))
}

export function encode<A, O>(schema: Schema<A, O>, value: A): O {
  return schema.encode(value)
}
