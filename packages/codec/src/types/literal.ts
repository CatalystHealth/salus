import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export type LiteralValue = string | number | boolean

export class LiteralCodec<T extends LiteralValue = LiteralValue> extends BaseCodec<T> {
  readonly _tag = 'LiteralCodec' as const

  constructor(public readonly value: T, options: CodecOptions<T> = {}) {
    super(options)
  }

  protected doIs(value: unknown): value is T {
    return value === this.value
  }

  protected doEncode(value: T): T {
    return value
  }

  protected doDecode(value: unknown, context: Context): Validation<T> {
    if (value !== this.value) {
      return failure(context, value, `must be exactly "${this.value as string}"`)
    }

    return success(this.value)
  }

  protected with(options: CodecOptions<T>): LiteralCodec<T> {
    return new LiteralCodec(this.value, options)
  }
}
