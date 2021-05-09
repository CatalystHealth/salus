import { Context } from '../context'
import { Validation } from '../validation'

import { BaseSchema, BaseOptions } from './internal'
import { Schema } from './schema'

export class LazySchema<A, O> extends BaseSchema<A, O> {
  constructor(private readonly getter: () => Schema<A, O>, options: BaseOptions<A> = {}) {
    super(options)
  }

  public get schema(): Schema<A, O> {
    return this.getter()
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

  protected with(options: BaseOptions<A>): LazySchema<A, O> {
    return new LazySchema(this.getter, options)
  }
}
