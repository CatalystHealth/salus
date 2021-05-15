import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class DateCodec extends BaseCodec<Date, string> {
  readonly _tag = 'DateCodec' as const

  protected doIs(value: unknown): value is Date {
    return value instanceof Date
  }

  protected doEncode(value: Date): string {
    return value.toISOString()
  }

  protected doDecode(value: unknown, context: Context): Validation<Date> {
    if (typeof value !== 'string') {
      return failure(context, value, 'must be a valid timestamp')
    }

    const parsed = new Date(value)
    if (isNaN(parsed.getTime())) {
      return failure(context, value, 'must be a valid timestamp')
    }

    return success(parsed)
  }

  protected with(options: CodecOptions<Date>): DateCodec {
    return new DateCodec(options)
  }
}
