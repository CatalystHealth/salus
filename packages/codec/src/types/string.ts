import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class StringCodec extends BaseCodec<string> {
  readonly _tag = 'StringCodec' as const

  protected doIs(value: unknown): value is string {
    return typeof value === 'string'
  }

  protected doEncode(value: string): string {
    return value
  }

  protected doDecode(value: unknown, context: Context): Validation<string> {
    if (typeof value !== 'string') {
      return failure(context, value, 'must be a string')
    }

    return success(value)
  }

  protected with(options: CodecOptions<string>): BaseCodec<string> {
    return new StringCodec(options)
  }
}
