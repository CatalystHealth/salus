import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseSchema, BaseOptions } from './internal'

export class StringSchema extends BaseSchema<string> {
  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is string {
    return typeof value === 'string'
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<string> {
    if (typeof value !== 'string') {
      return failure(context, value, 'must be a string')
    }

    return success(value)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: string): string {
    return value
  }

  /**
   * Applies a maximum length constraint
   *
   * @param max the maximum length for this string
   * @param message an override to apply to the message
   * @returns a new schema with the length constraint applied
   */
  public maxLength(max: number, message?: string): StringSchema {
    return this.refine((value, args) => value.length <= args, {
      type: 'maxLength',
      arguments: max,
      message: message ?? `must not exceed ${max} characters`
    })
  }

  /**
   * Applies a minimum length constraint
   *
   * @param min the minimum length for this string
   * @param message an override to apply to the message
   * @returns a new schema with the length constraint applied
   */
  public minLength(min: number, message?: string): StringSchema {
    return this.refine((value, args) => value.length >= args, {
      type: 'minLength',
      arguments: min,
      message: message ?? `must be at least ${min} characters`
    })
  }

  /**
   * Short hand for applying a minimum and a maximum length
   *
   * @param min the minimum length for this string
   * @param max the maximum length for this string
   * @returns a new schema with the length constriant applied
   */
  public length(min: number, max: number): StringSchema {
    return this.minLength(min).maxLength(max)
  }

  /**
   * Applies a pattern constraint to the schema
   *
   * @param expression the expression to match
   * @param message a custom message to apply to the constraint
   * @returns a new schema with the constraint applied
   */
  public pattern(expression: RegExp, message?: string): StringSchema {
    return this.refine((value, args) => args.test(value), {
      type: 'pattern',
      arguments: expression,
      message: message ?? `must match pattern ${expression.source}`
    })
  }

  /**
   * Applies an enum constraint to the schema
   *
   * @param values the possible values for the schema
   * @param message a custom message to apply to the constraint
   * @returns a new schema with the constraint applied
   */
  public enum(values: string[], message?: string): StringSchema {
    return this.refine((value, args) => args.indexOf(value) > -1, {
      type: 'enum',
      arguments: values,
      message: message ?? `must be one of: ${values.join(', ')}`
    })
  }

  // Override

  protected with(options: BaseOptions<string>): StringSchema {
    return new StringSchema(options)
  }
}
