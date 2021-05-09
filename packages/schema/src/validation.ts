import { Context } from './context'
import { Schema } from './types/schema'

export interface ValidationError {
  path: string[]
  message?: string
  schema: Schema<unknown>
  value: unknown
}

export interface Valid<T> {
  valid: true
  value: T
}

export interface Invalid {
  valid: false
  errors: ValidationError[]
}

export type Validation<T> = Valid<T> | Invalid

export function success<T>(value: T): Validation<T> {
  return {
    valid: true,
    value
  }
}

export function failure<T>(context: Context, value: unknown, message?: string): Validation<T> {
  return {
    valid: false,
    errors: [
      {
        path: context.entries.map(({ key }) => key),
        schema: context.current.schema,
        message,
        value
      }
    ]
  }
}

export function failures<T>(errors: ValidationError[]): Validation<T> {
  return {
    valid: false,
    errors
  }
}
