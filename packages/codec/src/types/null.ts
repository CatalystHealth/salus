import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class NullCodec extends BaseCodec<null> {
  readonly _tag = 'NullCodec' as const

  protected doIs(value: unknown): value is null {
    return value === null
  }

  protected doEncode(): null {
    return null
  }

  protected doDecode(value: unknown, context: Context): Validation<null> {
    if (value !== null) {
      return failure(context, value, 'must be null')
    }

    return success(null)
  }

  protected with(options: CodecOptions<null>): NullCodec {
    return new NullCodec(options)
  }
}
