import { Codec } from '../codec'
import { Context } from '../context'
import { failure, failures, success, Validation, ValidationError } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class ArrayCodec<A, O = A> extends BaseCodec<A[], O[]> {
  readonly _tag = 'ArrayCodec' as const

  constructor(public readonly itemCodec: Codec<A, O>, options: CodecOptions<A[]> = {}) {
    super(options)
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
    if (!Array.isArray(value)) {
      return failure(context, value, 'must be an array')
    }

    const values: A[] = new Array<A>(value.length)
    const errors: ValidationError[] = []

    for (let i = 0; i < value.length; i++) {
      const item = value[i] as unknown
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
    return new ArrayCodec(this.itemCodec, options)
  }
}
