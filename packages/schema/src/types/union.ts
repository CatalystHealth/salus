import { Context } from '../context'
import { TypeOf, OutputOf } from '../types'
import { Validation, failure, ValidationError } from '../validation'

import { BaseSchema, BaseOptions } from './internal'
import { Schema } from './schema'

export class UnionSchema<CS extends Schema<unknown>> extends BaseSchema<TypeOf<CS>, OutputOf<CS>> {
  constructor(public readonly schemas: CS[], options?: BaseOptions<TypeOf<CS>>) {
    super(options)
  }

  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is TypeOf<CS> {
    return this.schemas.some((schema) => schema.is(value))
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<TypeOf<CS>> {
    const errors: ValidationError[] = []
    for (const schema of this.schemas) {
      const decoded = schema.decode(value, context)
      if (decoded.valid) {
        return decoded as Validation<TypeOf<CS>>
      } else if (decoded.errors.length > 0) {
        errors.push(decoded.errors[0])
      }
    }

    return failure(
      context,
      value,
      `must meet one of the following criteria: ${errors.map((item) => item.message).join(', ')}`
    )
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: TypeOf<CS>): OutputOf<CS> {
    const activeSchema = this.schemas.find((schema) => schema.is(value))
    if (!activeSchema) {
      throw new Error('Value does not conform to any schema')
    }

    return activeSchema.encode(value) as OutputOf<CS>
  }

  // Override

  protected with(options: BaseOptions<TypeOf<CS>>): UnionSchema<CS> {
    return new UnionSchema(this.schemas, options)
  }
}
