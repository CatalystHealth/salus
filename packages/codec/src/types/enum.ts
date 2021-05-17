import { Context } from '../context'
import { Validation, failure, success } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class EnumCodec<E extends string> extends BaseCodec<E, string> {
  public readonly _tag = 'EnumCodec' as const
  public readonly enumValues: Set<string>

  constructor(
    private readonly enumObject: Record<string, E> | ReadonlyArray<E>,
    options: CodecOptions<E> = {}
  ) {
    super(options)

    this.enumValues = Array.isArray(enumObject)
      ? new Set(enumObject)
      : new Set(Object.values(enumObject))
  }

  protected doIs(value: unknown): value is E {
    return typeof value === 'string' && this.enumValues.has(value)
  }

  protected doDecode(value: unknown, context: Context): Validation<E> {
    if (typeof value !== 'string') {
      return failure(context, value, 'must be a string')
    }

    if (!this.enumValues.has(value)) {
      return failure(context, value, `must be one of: ${[...this.enumValues].join(', ')}`)
    }

    return success(value as E)
  }

  public doEncode(value: E): string {
    return value
  }

  // Override

  protected with(options: CodecOptions<E>): EnumCodec<E> {
    return new EnumCodec(this.enumObject, options)
  }
}
