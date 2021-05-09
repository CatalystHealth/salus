import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseSchema, BaseOptions } from './internal'

export class UndefinedSchema extends BaseSchema<undefined> {
  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is undefined {
    return typeof value === 'undefined'
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<undefined> {
    if (typeof value !== 'undefined') {
      return failure(context, value, 'must be undefined')
    }

    return success(value)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: undefined): undefined {
    return value
  }

  // Override

  protected with(options: BaseOptions<undefined>): UndefinedSchema {
    return new UndefinedSchema(options)
  }
}
