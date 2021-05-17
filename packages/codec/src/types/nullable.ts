import { Codec } from '../codec'
import { Context } from '../context'
import { success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from '.'

export class NullableCodec<A, O = A> extends BaseCodec<A | null, O | null> {
  readonly _tag = 'NullableCodec' as const

  constructor(public readonly innerCodec: Codec<A, O>, options: CodecOptions<A | null> = {}) {
    super(options)
  }

  protected doIs(value: unknown, context: Context): value is A | null {
    return value === null || this.innerCodec.is(value, context.replace(this.innerCodec))
  }

  protected doEncode(value: A | null, context: Context): O | null {
    return value === null ? null : this.innerCodec.encode(value, context.replace(this.innerCodec))
  }

  protected doDecode(value: unknown, context: Context): Validation<A | null> {
    if (value === null) {
      return success(value)
    }

    return this.innerCodec.decode(value, context.replace(this.innerCodec))
  }

  protected with(options: CodecOptions<A | null>): NullableCodec<A, O> {
    return new NullableCodec(this.innerCodec, options)
  }

  public nullable(): NullableCodec<A | null, O | null> {
    return this as NullableCodec<A | null, O | null>
  }
}
