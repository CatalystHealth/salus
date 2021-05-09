import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseSchema, BaseOptions } from './internal'

export class LiteralSchema<E extends string> extends BaseSchema<E, E> {
  constructor(public readonly value: E, options: BaseOptions<E> = {}) {
    super(options)
  }

  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is E {
    return value === this.value
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<E> {
    if (typeof value !== this.value) {
      return failure(context, value, `must be ${this.value}`)
    }

    return success(value as E)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: E): E {
    return value
  }

  // Override

  protected with(options: BaseOptions<E>): LiteralSchema<E> {
    return new LiteralSchema(this.value, options)
  }
}
