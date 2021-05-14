import { Codec } from './codec'
import { Context } from './context'

export interface ValidationError {
  /**
   * Path to the field that failed validation
   */
  readonly path: string[]

  /**
   * Actual value that was passed to the validator
   */
  readonly value: unknown

  /**
   * Codec that we tried to validate gainst
   */
  readonly codec: Codec<unknown>

  /**
   * Error that was encountered during the validation
   */
  readonly message: string
}

export type Valid<T> = {
  /**
   * When valid, always true
   */
  readonly success: true

  /**
   * The value that passed validation
   */
  readonly value: T
}

export type Invalid = {
  /**
   * When invalid, always false
   */
  readonly success: false

  /**
   * The errors that were encountered during validation
   */
  readonly errors: ValidationError[]
}

export type Validation<T> = Valid<T> | Invalid

/**
 * Creates a successful validation response with the given value
 *
 * @param value the value to include in the validation response
 * @return the validation response
 */
export function success<T>(value: T): Valid<T> {
  return {
    success: true,
    value
  }
}

/**
 * Creates a failing validation response with the given error
 *
 * @param context the context in the validation pipeline
 * @param value the value that was encountered
 * @param message the reason for the validation failure
 * @return the validation response
 */
export function failure(context: Context, value: unknown, message: string): Invalid {
  return {
    success: false,
    errors: [
      {
        path: context.entries.map(({ key }) => key).splice(1),
        codec: context.current.codec,
        message,
        value
      }
    ]
  }
}

/**
 * Creates a failing validation response with the given errors
 *
 * @param errors the errors to invalid in the validation response
 * @return the validation response
 */
export function failures(errors: ValidationError[]): Invalid {
  return {
    success: false,
    errors
  }
}
