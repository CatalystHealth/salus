import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class BooleanCodec extends BaseCodec<boolean> {
  readonly _tag = 'BooleanCodec' as const

  protected doIs(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }

  protected doEncode(value: boolean): boolean {
    return value
  }

  protected doDecode(value: unknown, context: Context): Validation<boolean> {
    if (typeof value !== 'boolean') {
      return failure(context, value, 'must be a boolean')
    }

    return success(value)
  }

  protected with(options: CodecOptions<boolean>): BaseCodec<boolean> {
    return new BooleanCodec(options)
  }
}
