import { Codec } from '../codec'
import { Context } from '../context'
import { failure, failures, success, Validation, ValidationError } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class ArrayCodec<A, O = A> extends BaseCodec<A[], O[]> {
  readonly _tag = 'ArrayCodec' as const

  constructor(
    public readonly itemCodec: Codec<A, O>,
    public readonly isLenient: boolean = false,
    options: CodecOptions<A[]> = {}
  ) {
    super(options)
    this.isLenient = isLenient
  }

  protected doIs(value: unknown, context: Context): value is A[] {
    return (
      Array.isArray(value) &&
      value.every((item, i) => this.itemCodec.is(item, context.enter(`${i}`, this.itemCodec)))
    )
  }

  protected doEncode(value: A[], context: Context): O[] {
    return value.map((item, i) =>
      this.itemCodec.encode(item, context.enter(`${i}`, this.itemCodec))
    )
  }

  protected doDecode(value: unknown, context: Context): Validation<A[]> {
    if (!Array.isArray(value) && !this.isLenient) {
      return failure(context, value, 'must be an array')
    }

    const inputValues = Array.isArray(value) ? value : [value]
    const values: A[] = new Array<A>(inputValues.length)
    const errors: ValidationError[] = []

    for (let i = 0; i < inputValues.length; i++) {
      const item = inputValues[i] as unknown
      const result = this.itemCodec.decode(item, context.enter(`${i}`, this.itemCodec))

      if (result.success) {
        values[i] = result.value
      } else {
        errors.push(...result.errors)
      }
    }

    if (errors.length > 0) {
      return failures(errors)
    }

    return success(values)
  }

  protected with(options: CodecOptions<A[]>): ArrayCodec<A, O> {
    return new ArrayCodec(this.itemCodec, this.isLenient, options)
  }

  //

  /**
   * Returns a copy of this schema that is lenient (permissive) on parsing
   *
   * When operating in lenient mode, the codec will tolerate non-arrays as input, provided
   * they conform to the item codec. The input will be automatically translated into an array
   * of one.
   *
   * Note that this only affects parsing unknown input. At runtime, you must always pass a
   * full array.
   *
   * @returns a new codec that is lenient
   */
  public lenient(): ArrayCodec<A, O> {
    return new ArrayCodec(this.itemCodec, true, this.options)
  }
}
