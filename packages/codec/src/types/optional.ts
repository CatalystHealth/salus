import { Codec } from '../codec'
import { Context } from '../context'
import { success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class OptionalCodec<A, O = A> extends BaseCodec<A | undefined, O | undefined> {
  readonly _tag = 'OptionalCodec' as const

  constructor(public readonly innerCodec: Codec<A, O>, options: CodecOptions<A | undefined> = {}) {
    super(options)
  }

  protected doIs(value: unknown, context: Context): value is A | undefined {
    return (
      typeof value === 'undefined' || this.innerCodec.is(value, context.replace(this.innerCodec))
    )
  }

  protected doEncode(value: A | undefined, context: Context): O | undefined {
    return typeof value === 'undefined'
      ? undefined
      : this.innerCodec.encode(value, context.replace(this.innerCodec))
  }

  protected doDecode(value: unknown, context: Context): Validation<A | undefined> {
    if (typeof value === 'undefined') {
      return success(value)
    }

    return this.innerCodec.decode(value, context.replace(this.innerCodec))
  }

  protected with(options: CodecOptions<A | undefined>): OptionalCodec<A, O> {
    return new OptionalCodec(this.innerCodec, options)
  }

  public optional(): OptionalCodec<A | undefined, O | undefined> {
    return this as OptionalCodec<A | undefined, O | undefined>
  }
}
