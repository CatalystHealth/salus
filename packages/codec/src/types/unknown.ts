import { success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class UnknownCodec extends BaseCodec<unknown> {
  readonly _tag = 'UnknownCodec' as const

  protected doIs(value: unknown): value is unknown {
    return true
  }

  protected doEncode(value: unknown): unknown {
    return value
  }

  protected doDecode(value: unknown): Validation<unknown> {
    return success(value)
  }

  protected with(options: CodecOptions<unknown>): UnknownCodec {
    return new UnknownCodec(options)
  }
}
