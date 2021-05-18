import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from '.'

export class IsoDateCodec extends BaseCodec<Date, string> {
  readonly _tag = 'IsoDateCodec' as const

  private readonly pattern = /^[0-9]{4}-[0-9]{2}-[0-9]{2}$/

  protected doIs(value: unknown): value is Date {
    return value instanceof Date
  }

  protected doEncode(value: Date): string {
    return value.toISOString().split('T')[0]
  }

  protected doDecode(value: unknown, context: Context): Validation<Date> {
    if (typeof value !== 'string' || !this.pattern.test(value)) {
      return failure(context, value, 'must be a valid date')
    }

    const parsed = new Date(`${value}T00:00:00.000Z`)
    if (isNaN(parsed.getTime())) {
      return failure(context, value, 'must be a valid date')
    }

    return success(parsed)
  }

  protected with(options: CodecOptions<Date>): IsoDateCodec {
    return new IsoDateCodec(options)
  }
}
