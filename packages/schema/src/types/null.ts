import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseSchema, BaseOptions } from './internal'

export class NullSchema extends BaseSchema<null> {
  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is null {
    return value === null
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<null> {
    if (value !== null) {
      return failure(context, value, 'must be null')
    }

    return success(value)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: null): null {
    return value
  }

  // Override

  protected with(options: BaseOptions<null>): NullSchema {
    return new NullSchema(options)
  }
}
