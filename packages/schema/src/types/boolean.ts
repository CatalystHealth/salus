import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseSchema, BaseOptions } from './internal'

export class BooleanSchema extends BaseSchema<boolean> {
  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<boolean> {
    if (typeof value !== 'boolean') {
      return failure(context, value, 'must be a boolean')
    }

    return success(value)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: boolean): boolean {
    return value
  }

  // Override

  protected with(options: BaseOptions<boolean>): BooleanSchema {
    return new BooleanSchema(options)
  }
}
