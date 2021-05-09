import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseSchema, BaseOptions } from './internal'

export class NumberSchema extends BaseSchema<number> {
  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is number {
    return typeof value === 'number'
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<number> {
    if (typeof value !== 'number') {
      return failure(context, value, 'must be a number')
    }

    return success(value)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: number): number {
    return value
  }

  /**
   * Applies a maximum constraint
   *
   * @param max the maximum value for this number
   * @param message an override to apply to the message
   * @returns a new schema with the value constraint applied
   */
  public max(max: number, message?: string): NumberSchema {
    return this.refine((value, args) => value <= args, {
      type: 'max',
      arguments: max,
      message: message ?? `must not be greater than ${max}`
    })
  }

  /**
   * Applies a minimum constraint
   *
   * @param min the minimum value for this number
   * @param message an override to apply to the message
   * @returns a new schema with the value constraint applied
   */
  public min(min: number, message?: string): NumberSchema {
    return this.refine((value, args) => value >= args, {
      type: 'min',
      arguments: min,
      message: message ?? `must not be less than ${min}`
    })
  }

  /**
   * Applies a multiple of constraint
   *
   * @param base the base to be a multiple of
   * @param message an override to apply to the message
   * @returns a new schema with the multiple constraint applied
   */
  public multipleOf(base: number, message?: string): NumberSchema {
    return this.refine((value, args) => value % args === 0, {
      type: 'multipleOf',
      arguments: base,
      message: message ?? `must be a multiple of ${base}`
    })
  }

  /**
   * Short hand for applying a minimum and a maximum length
   *
   * @param min the minimum length for this string
   * @param max the maximum length for this string
   * @returns a new schema with the length constriant applied
   */
  public range(min: number, max: number): NumberSchema {
    return this.min(min).max(max)
  }

  // Override

  protected with(options: BaseOptions<number>): NumberSchema {
    return new NumberSchema(options)
  }
}
