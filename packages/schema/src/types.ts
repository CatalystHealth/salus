import { Schema } from './types/schema'

export type TypeOf<P> = P extends Schema<infer A, unknown> ? A : never
export type OutputOf<P> = P extends Schema<unknown, infer O> ? O : never
