import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { NullableCodec } from './nullable'

import { BaseCodec, CodecOptions } from './'

export class StringCodec extends BaseCodec<string> {
  readonly _tag = 'StringCodec' as const

  constructor(options: CodecOptions<string> = {}) {
    super(options)
  }

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

  public notEmpty(message?: string): StringCodec {
    return this.minLength(1, message ?? 'must not be empty')
  }

  public minLength(length: number, message?: string): StringCodec {
    return this.refine((input, len) => input.length >= len, {
      type: 'minLength',
      arguments: length,
      message: message ?? `must be at least ${length} characters`
    })
  }

  public maxLength(length: number, message?: string): StringCodec {
    return this.refine((input, len) => input.length <= len, {
      type: 'maxLength',
      arguments: length,
      message: message ?? `must be no more than ${length} characters`
    })
  }

  public pattern(pattern: RegExp, message?: string): StringCodec {
    return this.refine((input, pattern) => pattern.test(input), {
      type: 'pattern',
      arguments: pattern,
      message: message ?? `must match ${pattern.source}`
    })
  }

  public trim(): StringCodec {
    return this.preprocess((value) => (typeof value === 'string' ? value.trim() : value))
  }

  public trimToNull(): NullableCodec<string, string> {
    return this.nullable().preprocess((value) =>
      typeof value === 'string' ? value.trim() || null : value
    )
  }
}
