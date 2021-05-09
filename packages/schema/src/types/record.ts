import { Context } from '../context'
import { Validation, failure, success, ValidationError, failures } from '../validation'

import { BaseSchema, BaseOptions } from './internal'
import { Schema } from './schema'

export class RecordSchema<A, O> extends BaseSchema<Record<string, A>, Record<string, O>> {
  constructor(public readonly valueSchema: Schema<A, O>, options?: BaseOptions<Record<string, A>>) {
    super(options)
  }

  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is Record<string, A> {
    if (!value || typeof value !== 'object') {
      return false
    }

    const castValue = value as Record<string, unknown>
    return Object.keys(castValue).every((key) => this.valueSchema.is(castValue[key]))
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<Record<string, A>> {
    if (!value || typeof value !== 'object') {
      return failure(context, value, 'must be an object')
    }

    const castValue = value as Record<string, unknown>
    const resultValue = {} as Record<string, A>
    const keys = Object.keys(castValue)
    const errors: ValidationError[] = []

    for (const key of keys) {
      const decoded = this.valueSchema.decode(castValue[key], context.enter(key, this.valueSchema))
      if (decoded.valid) {
        resultValue[key] = decoded.value
      } else {
        errors.push(...decoded.errors)
      }
    }

    if (errors.length > 0) {
      return failures(errors)
    }

    return success(resultValue)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: Record<string, A>): Record<string, O> {
    const keys = Object.keys(value)
    const resultValue = {} as Record<string, O>

    for (const key of keys) {
      resultValue[key] = this.valueSchema.encode(value[key])
    }

    return resultValue
  }

  // Override

  protected with(options: BaseOptions<Record<string, A>>): RecordSchema<A, O> {
    return new RecordSchema(this.valueSchema, options)
  }
}
