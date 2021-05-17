import { Context } from '../context'
import { Any, OutputOf, TypeOf } from '../infer'
import { failures, Validation, ValidationError } from '../validation'

import { BaseCodec, CodecOptions } from './'

export class UnionCodec<CS extends [Any, Any, ...Any[]]> extends BaseCodec<
  TypeOf<CS[number]>,
  OutputOf<CS[number]>
> {
  readonly _tag = 'UnionCodec' as const

  constructor(public readonly codecs: CS, options: CodecOptions<TypeOf<CS[number]>> = {}) {
    super(options)
  }

  protected doIs(value: unknown, context: Context): value is TypeOf<CS[number]> {
    return this.codecs.some((codec) => codec.is(value, context.enter('', codec)))
  }

  protected doEncode(value: string, context: Context): OutputOf<CS[number]> {
    const codec = this.codecs.find((codec) => codec.is(value))
    if (!codec) {
      throw new Error('Unable to runtime codec')
    }

    return codec.encode(value, context.enter('', codec))
  }

  protected doDecode(value: unknown, context: Context): Validation<TypeOf<CS[number]>> {
    const errors: ValidationError[] = []

    for (const codec of this.codecs) {
      const result = codec.decode(value, context.enter('', codec))
      if (result.success) {
        return result
      } else {
        errors.push(...result.errors)
      }
    }

    return failures(errors)
  }

  protected with(options: CodecOptions<TypeOf<CS[number]>>): UnionCodec<CS> {
    return new UnionCodec(this.codecs, options)
  }
}
