import { Context } from '../context'
import { Any, OutputOf, TypeOf } from '../infer'
import { failure, failures, success, Validation, ValidationError } from '../validation'

import { BaseCodec, CodecOptions } from './'

export type TupleTypeOf<CS extends Any[]> = CS extends {
  length: 1
}
  ? [TypeOf<CS[0]>]
  : CS extends {
      length: 2
    }
  ? [TypeOf<CS[0]>, TypeOf<CS[1]>]
  : CS extends {
      length: 3
    }
  ? [TypeOf<CS[0]>, TypeOf<CS[1]>, TypeOf<CS[2]>]
  : CS extends {
      length: 4
    }
  ? [TypeOf<CS[0]>, TypeOf<CS[1]>, TypeOf<CS[2]>, TypeOf<CS[3]>]
  : CS extends {
      length: 5
    }
  ? [TypeOf<CS[0]>, TypeOf<CS[1]>, TypeOf<CS[2]>, TypeOf<CS[3]>, TypeOf<CS[4]>]
  : any[]

export type TupleOutputOf<CS extends Any[]> = CS extends {
  length: 1
}
  ? [OutputOf<CS[0]>]
  : CS extends {
      length: 2
    }
  ? [OutputOf<CS[0]>, OutputOf<CS[1]>]
  : CS extends {
      length: 3
    }
  ? [OutputOf<CS[0]>, OutputOf<CS[1]>, OutputOf<CS[2]>]
  : CS extends {
      length: 4
    }
  ? [OutputOf<CS[0]>, OutputOf<CS[1]>, OutputOf<CS[2]>, OutputOf<CS[3]>]
  : CS extends {
      length: 5
    }
  ? [OutputOf<CS[0]>, OutputOf<CS[1]>, OutputOf<CS[2]>, OutputOf<CS[3]>, OutputOf<CS[4]>]
  : any[]

export class TupleCodec<CS extends Any[]> extends BaseCodec<TupleTypeOf<CS>, TupleOutputOf<CS>> {
  readonly _tag = 'TupleCodec' as const

  constructor(public readonly codecs: CS, options: CodecOptions<TupleTypeOf<CS>> = {}) {
    super(options)
  }

  protected doIs(value: unknown, context: Context): value is TupleTypeOf<CS> {
    return (
      Array.isArray(value) &&
      value.every((item, i) => this.codecs[i].is(item, context.enter(`${i}`, this.codecs[i])))
    )
  }

  protected doEncode(value: TupleTypeOf<CS>, context: Context): TupleOutputOf<CS> {
    return value.map((item, i) =>
      this.codecs[i].encode(item, context.enter(`${i}`, this.codecs[i]))
    ) as TupleOutputOf<CS>
  }

  protected doDecode(value: unknown, context: Context): Validation<TupleTypeOf<CS>> {
    if (!Array.isArray(value)) {
      return failure(context, value, 'must be an array')
    }

    if (value.length !== this.codecs.length) {
      return failure(context, value, `must have exactly ${this.codecs.length} values`)
    }

    const inputValues = Array.isArray(value) ? value : [value]
    const values: any[] = new Array<any>(inputValues.length)
    const errors: ValidationError[] = []

    for (let i = 0; i < inputValues.length; i++) {
      const item = inputValues[i] as unknown
      const result = this.codecs[i].decode(item, context.enter(`${i}`, this.codecs[i]))

      if (result.success) {
        values[i] = result.value
      } else {
        errors.push(...result.errors)
      }
    }

    if (errors.length > 0) {
      return failures(errors)
    }

    return success(values as TupleTypeOf<CS>)
  }

  protected with(options: CodecOptions<TupleTypeOf<CS>>): TupleCodec<CS> {
    return new TupleCodec(this.codecs, options)
  }
}
