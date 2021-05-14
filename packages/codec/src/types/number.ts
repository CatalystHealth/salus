import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './base'

export class NumberCodec extends BaseCodec<number> {
  readonly _tag = 'NumberCodec' as const

  protected doIs(value: unknown): value is number {
    return typeof value === 'number'
  }

  protected doEncode(value: number): number {
    return value
  }

  protected doDecode(value: unknown, context: Context): Validation<number> {
    if (typeof value !== 'number') {
      return failure(context, value, 'must be a number')
    }

    return success(value)
  }

  protected with(options: CodecOptions<number>): BaseCodec<number> {
    return new NumberCodec(options)
  }
}
