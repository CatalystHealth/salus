import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class BooleanCodec extends BaseCodec<boolean> {
  readonly _tag = 'BooleanCodec' as const
  static readonly possibleValues = ['true', 'false']

  constructor(public readonly isLenient: boolean = false, options: CodecOptions<boolean> = {}) {
    super(options)
  }

  protected doIs(value: unknown): value is boolean {
    return typeof value === 'boolean'
  }

  protected doEncode(value: boolean): boolean {
    return value
  }

  protected doDecode(value: unknown, context: Context): Validation<boolean> {
    if (typeof value === 'boolean') {
      return success(value)
    } else if (typeof value === 'string') {
      const lowerValue = value.toLowerCase()
      if (lowerValue === 'true') {
        return success(true)
      } else if (lowerValue === 'false') {
        return success(false)
      }
    }

    return failure(context, value, 'must be a boolean')
  }

  protected with(options: CodecOptions<boolean>): BaseCodec<boolean> {
    return new BooleanCodec(this.isLenient, options)
  }

  public lenient(): BooleanCodec {
    return new BooleanCodec(true, this.options)
  }
}
