import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class StringCodec extends BaseCodec<string> {
  readonly _tag = 'StringCodec' as const

  private readonly trimString: boolean
  public readonly rejectEmpty: boolean

  constructor(
    trimString: boolean = false,
    rejectEmpty: boolean = true,
    options: CodecOptions<string> = {}
  ) {
    super(options)
    this.trimString = trimString
    this.rejectEmpty = rejectEmpty
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

    const result = this.trimString ? value.trim() : value

    if (this.rejectEmpty && result === '') {
      return failure(context, value, 'must not be empty')
    }

    return success(result)
  }

  protected with(options: CodecOptions<string>): BaseCodec<string> {
    return new StringCodec(this.trimString, this.rejectEmpty, options)
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

  public allowEmpty(): StringCodec {
    return new StringCodec(this.trimString, false, this.options)
  }

  public trim(): StringCodec {
    return new StringCodec(true, this.rejectEmpty, this.options)
  }
}
