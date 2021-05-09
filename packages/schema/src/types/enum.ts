import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseSchema, BaseOptions } from './internal'

export class EnumSchema<E extends string> extends BaseSchema<E, string> {
  private readonly enumValues: Set<string>

  constructor(public readonly enumObject: Record<string, E>, options: BaseOptions<E> = {}) {
    super(options)

    this.enumValues = new Set(Object.values(enumObject))
  }

  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is E {
    return typeof value === 'string' && this.enumValues.has(value)
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<E> {
    if (typeof value !== 'string') {
      return failure(context, value, 'must be a string')
    }

    if (!this.enumValues.has(value)) {
      return failure(context, value, `must be one of: ${[...this.enumValues].join(', ')}'`)
    }

    return success(value as E)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: E): string {
    return value
  }

  // Override

  protected with(options: BaseOptions<E>): EnumSchema<E> {
    return new EnumSchema(this.enumObject, options)
  }
}
