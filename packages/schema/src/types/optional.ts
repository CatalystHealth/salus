import { Context } from '../context'
import { Validation } from '../validation'

import { BaseOptions, BaseSchema } from './internal'
import { Schema } from './schema'

export class OptionalSchema<A, O> extends BaseSchema<A, O> {
  readonly tag: 'OptionalType' = 'OptionalType'

  constructor(public readonly schema: Schema<A, O>, options: BaseOptions<A> = {}) {
    super(options)
  }

  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is A {
    return this.schema.is(value)
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<A> {
    return this.schema.decode(value, context)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: A): O {
    return this.schema.encode(value)
  }

  // Override

  protected with(options: BaseOptions<A>): OptionalSchema<A, O> {
    return new OptionalSchema(this.schema, options)
  }
}
