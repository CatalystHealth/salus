import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from '.'

export class IsoDateTimeCodec extends BaseCodec<Date, string> {
  readonly _tag = 'IsoDateTimeCodec' as const
  // JS Date object does not handle leap seconds, so no need to expect 60 in the seconds field.
  private readonly pattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}T[0-2][0-9]:[0-5][0-9]:[0-5][0-9](.[0-9]{3})?(([+-]\d\d:\d\d)|Z)$/

  protected doIs(value: unknown): value is Date {
    return value instanceof Date
  }

  protected doEncode(value: Date): string {
    return value.toISOString()
  }

  protected doDecode(value: unknown, context: Context): Validation<Date> {
    if (typeof value !== 'string' || !this.pattern.test(value)) {
      return failure(context, value, 'must be a valid ISO datetime')
    }

    const parsed = new Date(value)
    if (isNaN(parsed.getTime())) {
      return failure(context, value, 'must be a valid ISO datetime')
    }

    return success(parsed)
  }

  protected with(options: CodecOptions<Date>): IsoDateTimeCodec {
    return new IsoDateTimeCodec(options)
  }
}
