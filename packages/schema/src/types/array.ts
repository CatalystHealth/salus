import { Context } from '../context'
import { Validation, failure, success, ValidationError, failures } from '../validation'

import { BaseSchema, BaseOptions } from './internal'
import { Schema } from './schema'

export class ArraySchema<A, O> extends BaseSchema<A[], O[]> {
  constructor(public readonly itemSchema: Schema<A, O>, options?: BaseOptions<A[]>) {
    super(options)
  }

  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is A[] {
    return Array.isArray(value) && value.every((item) => this.itemSchema.is(item))
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<A[]> {
    if (!Array.isArray(value)) {
      return failure(context, value, 'must be an array')
    }

    const results = [] as A[]
    const errors: ValidationError[] = []

    for (let i = 0; i < value.length; i++) {
      const item = value[i] as unknown
      const decoded = this.itemSchema.decode(item, context.enter(`${i}`, this.itemSchema))
      if (decoded.valid) {
        results.push(decoded.value)
      } else {
        errors.push(...decoded.errors)
      }
    }

    if (errors.length > 0) {
      return failures(errors)
    }

    return success(results)
  }

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: A[]): O[] {
    return value.map((item) => this.itemSchema.encode(item))
  }

  /**
   * Applies a maximum length constraint
   *
   * @param max the maximum length for this string
   * @param message an override to apply to the message
   * @returns a new schema with the length constraint applied
   */
  public maxLength(max: number, message?: string): ArraySchema<A, O> {
    return this.refine((value, args) => value.length <= args, {
      type: 'maxLength',
      arguments: max,
      message: message ?? `must not exceed ${max} items`
    })
  }

  /**
   * Applies a minimum length constraint
   *
   * @param min the minimum length for this string
   * @param message an override to apply to the message
   * @returns a new schema with the length constraint applied
   */
  public minLength(min: number, message?: string): ArraySchema<A, O> {
    return this.refine((value, args) => value.length >= args, {
      type: 'minLength',
      arguments: min,
      message: message ?? `must be at least ${min} items`
    })
  }

  /**
   * Short hand for applying a minimum and a maximum length
   *
   * @param min the minimum length for this string
   * @param max the maximum length for this string
   * @returns a new schema with the length constriant applied
   */
  public length(min: number, max: number): ArraySchema<A, O> {
    return this.minLength(min).maxLength(max)
  }

  // Override

  protected with(options: BaseOptions<A[]>): ArraySchema<A, O> {
    return new ArraySchema(this.itemSchema, options)
  }
}
