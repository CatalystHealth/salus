import { Context } from '../context'
import { Any, OutputOf, TypeOf } from '../infer'
import { isRecord } from '../utils'
import { failure, ValidationError, Validation, failures, success } from '../validation'

import { BaseCodec, CodecOptions } from './'

export type Props = {
  [key: string]: Any
}

export type TypeOfProps<P extends Props> = {
  [K in keyof P]: TypeOf<P[K]>
}

export type OutputOfProps<P extends Props> = {
  [K in keyof P]: OutputOf<P[K]>
}

export class ObjectCodec<P extends Props> extends BaseCodec<TypeOfProps<P>, OutputOfProps<P>> {
  public readonly _tag = 'ObjectCodec' as const
  public readonly properties: Set<string>
  public readonly requiredProperties: Set<string>

  constructor(public readonly props: P, options: CodecOptions<TypeOfProps<P>> = {}) {
    super(options)

    // Cache the well-known set of keys
    const cachedKeys = Object.keys(props)
    this.properties = new Set([...cachedKeys])
    this.requiredProperties = new Set([...cachedKeys])
  }

  protected doIs(value: unknown, context: Context): value is TypeOfProps<P> {
    if (!isRecord(value)) {
      return false
    }

    for (const property of this.properties) {
      const codec = this.props[property]
      if (!codec.is(value[property], context.enter(property, codec))) {
        return false
      }
    }

    return true
  }

  protected doDecode(value: unknown, context: Context): Validation<TypeOfProps<P>> {
    if (!isRecord(value)) {
      return failure(context, value, 'must be an object')
    }

    const requiredKeys: Set<string> = new Set([...this.requiredProperties])
    const providedKeys = new Set([...Object.keys(value)])
    const output: Record<string, unknown> = {}
    const errors: ValidationError[] = []
    for (const key of this.properties) {
      if (!providedKeys.has(key)) {
        continue
      }

      const codec = this.props[key]
      const result = codec.decode(value[key], context.enter(key, codec))

      if (!result.success) {
        errors.push(...result.errors)
      } else {
        output[key] = result.value
      }

      requiredKeys.delete(key)
    }

    if (requiredKeys.size > 0) {
      return failure(context, value, `missing required keys: ${[...requiredKeys].join(', ')}`)
    }

    if (errors.length > 0) {
      return failures(errors)
    }

    return success(output as TypeOfProps<P>)
  }

  protected doEncode(value: TypeOfProps<P>): OutputOfProps<P> {
    const castValue = value as Record<string, unknown>
    const output: Record<string, unknown> = {}

    for (const key of this.properties) {
      const schema = this.props[key]
      const value = castValue[key]

      if (this.requiredProperties.has(key) || typeof value !== 'undefined') {
        output[key] = schema.encode(castValue[key])
      }
    }

    return output as OutputOfProps<P>
  }

  // Override

  protected with(options: CodecOptions<TypeOfProps<P>>): ObjectCodec<P> {
    return new ObjectCodec(this.props, options)
  }
}
