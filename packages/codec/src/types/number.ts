import { Context } from '../context'
import { failure, success, Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class NumberCodec extends BaseCodec<number> {
  readonly _tag = 'NumberCodec' as const

  constructor(public readonly isLenient: boolean = false, options: CodecOptions<number> = {}) {
    super(options)
  }

  protected doIs(value: unknown): value is number {
    return typeof value === 'number'
  }

  protected doEncode(value: number): number {
    return value
  }

  protected doDecode(value: unknown, context: Context): Validation<number> {
    if (typeof value !== 'number' && (!this.isLenient || typeof value !== 'string')) {
      return failure(context, value, 'must be a number')
    }

    if (typeof value === 'string') {
      const parsedNumber = Number(value)
      if (isNaN(parsedNumber)) {
        return failure(context, value, 'must be a number')
      } else {
        return success(parsedNumber)
      }
    } else {
      return success(value)
    }
  }

  protected with(options: CodecOptions<number>): BaseCodec<number> {
    return new NumberCodec(this.isLenient, options)
  }

  public lenient(): NumberCodec {
    return new NumberCodec(true, this.options)
  }

  public integer(message?: string): NumberCodec {
    return this.refine((input) => Math.round(input) === input, {
      type: 'integer',
      arguments: null,
      message: message ?? 'must be an integer'
    })
  }

  public min(min: number, message?: string): NumberCodec {
    return this.refine((input, min) => input >= min, {
      type: 'min',
      arguments: min,
      message: message ?? `must be at least ${min}`
    })
  }

  public max(max: number, message?: string): NumberCodec {
    return this.refine((input, max) => input <= max, {
      type: 'max',
      arguments: max,
      message: message ?? `must be at most ${max}`
    })
  }
}
