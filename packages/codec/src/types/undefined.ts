import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class UndefinedCodec extends BaseCodec<undefined> {
  readonly _tag = 'UndefinedCodec' as const

  protected doIs(value: unknown): value is undefined {
    return value === undefined
  }

  protected doEncode(): undefined {
    return undefined
  }

  protected doDecode(value: unknown, context: Context): Validation<undefined> {
    if (value !== undefined) {
      return failure(context, value, 'must be undefined')
    }

    return success(undefined)
  }

  protected with(options: CodecOptions<undefined>): UndefinedCodec {
    return new UndefinedCodec(options)
  }
}
