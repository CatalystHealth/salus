import { Context } from '../context'
import { Any, OutputOf, TypeOf } from '../infer'
import { isRecord } from '../utils'
import { failure, failures, success, Validation, ValidationError } from '../validation'

import { BaseCodec, CodecOptions } from './base'

export class RecordCodec<K extends Any, V extends Any> extends BaseCodec<
  Record<TypeOf<K>, TypeOf<V>>,
  Record<OutputOf<K>, OutputOf<V>>
> {
  readonly _tag = 'RecordCodec' as const

  constructor(
    public readonly keyCodec: K,
    public readonly valueCodec: V,
    options: CodecOptions<Record<TypeOf<K>, TypeOf<V>>> = {}
  ) {
    super(options)
  }

  protected doIs(value: unknown, context: Context): value is Record<TypeOf<K>, TypeOf<V>> {
    if (!isRecord(value)) {
      return false
    }

    return Object.entries(value).every(([key, value]) => {
      return (
        this.keyCodec.is(key, context.enter(key, this.keyCodec)) &&
        this.valueCodec.is(value, context.enter(key, this.valueCodec))
      )
    })
  }

  protected doEncode(
    value: Record<TypeOf<K>, TypeOf<V>>,
    context: Context
  ): Record<OutputOf<K>, OutputOf<V>> {
    return Object.fromEntries(
      Object.entries(value).map(([key, value]) => [
        this.keyCodec.encode(key, context.enter(key, this.keyCodec)),
        this.valueCodec.encode(value, context.enter(key, this.valueCodec))
      ])
    )
  }

  protected doDecode(value: unknown, context: Context): Validation<Record<TypeOf<K>, TypeOf<V>>> {
    if (!isRecord(value)) {
      return failure(context, value, 'must be an object')
    }

    const entries = Object.entries(value)
    const errors: ValidationError[] = []
    const result = {} as Record<TypeOf<K>, TypeOf<V>>

    for (const [key, value] of entries) {
      const decodedKey = this.keyCodec.decode(key, context.enter(key, this.keyCodec))
      const decodedValue = this.valueCodec.decode(value, context.enter(key, this.valueCodec))

      if (!decodedKey.success) {
        errors.push(...decodedKey.errors)
      }

      if (!decodedValue.success) {
        errors.push(...decodedValue.errors)
      }

      if (!decodedKey.success || !decodedValue.success) {
        continue
      }

      result[decodedKey.value as TypeOf<K>] = decodedValue.value
    }

    if (errors.length > 0) {
      return failures(errors)
    }

    return success(result)
  }

  protected with(options: CodecOptions<Record<TypeOf<K>, TypeOf<V>>>): RecordCodec<K, V> {
    return new RecordCodec(this.keyCodec, this.valueCodec, options)
  }
}
