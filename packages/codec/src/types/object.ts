import { Context } from '../context'
import { Any, OutputOf, TypeOf } from '../infer'
import { isRecord, Optionalize, OptionalKeys } from '../utils'
import { failure, ValidationError, Validation, failures, success } from '../validation'

import { BaseCodec, CodecOptions, OptionalCodec } from './'

export type Partialize<P extends Props> = {
  [K in keyof P]: P[K] extends OptionalCodec<any, any>
    ? P[K]
    : OptionalCodec<P[K]['_A'], P[K]['_O']>
}

export type Props = {
  [key: string]: Any
}

export type TypeOfProps<P extends Props> = Optionalize<
  {
    [K in keyof P]: TypeOf<P[K]>
  },
  OptionalKeys<P>
>

export type OutputOfProps<P extends Props> = Optionalize<
  {
    [K in keyof P]: OutputOf<P[K]>
  },
  OptionalKeys<P>
>

export class ObjectCodec<P extends Props> extends BaseCodec<TypeOfProps<P>, OutputOfProps<P>> {
  public readonly _tag = 'ObjectCodec' as const
  public readonly properties: Set<string>
  public readonly requiredProperties: Set<string>

  constructor(public readonly props: P, options: CodecOptions<TypeOfProps<P>> = {}) {
    super(options)

    // Cache the well-known set of keys
    const cachedKeys = Object.keys(props)
    this.properties = new Set([...cachedKeys])
    this.requiredProperties = new Set([
      ...cachedKeys.filter((key) => this.props[key]._tag !== 'OptionalCodec')
    ])
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

    let missingRequired = false
    const output: Record<string, unknown> = {}
    const errors: ValidationError[] = []
    for (const key of this.properties) {
      if (!Object.prototype.hasOwnProperty.call(value, key)) {
        if (!missingRequired && this.requiredProperties.has(key)) {
          missingRequired = true
        }

        continue
      }

      const codec = this.props[key]
      const result = codec.decode(value[key], context.enter(key, codec))

      if (!result.success) {
        errors.push(...result.errors)
      } else {
        output[key] = result.value
      }
    }

    if (missingRequired) {
      const missingKeys = [...this.requiredProperties].filter(
        (prop) => !Object.prototype.hasOwnProperty.call(value, prop)
      )

      return failure(context, value, `missing required keys: ${[...missingKeys].join(', ')}`)
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

  public partial(): ObjectCodec<Partialize<P>> {
    return ObjectCodec.partial(this.props)
  }

  public omit<K extends keyof P>(keys: K[]): ObjectCodec<Omit<P, K>> {
    const copiedProps = { ...this.props }
    for (const key of keys) {
      delete copiedProps[key]
    }

    return (new ObjectCodec(copiedProps) as unknown) as ObjectCodec<Omit<P, K>>
  }

  public extend<OP extends Props>(otherProps: OP): ObjectCodec<Omit<P, keyof OP> & OP> {
    return (new ObjectCodec({
      ...this.props,
      ...otherProps
    }) as unknown) as ObjectCodec<Omit<P, keyof OP> & OP>
  }

  public static partial<P extends Props>(props: P): ObjectCodec<Partialize<P>> {
    return new ObjectCodec(
      Object.fromEntries(
        Object.entries(props).map(([key, child]) => [
          key,
          child instanceof OptionalCodec ? child : new OptionalCodec(child)
        ])
      )
    ) as ObjectCodec<Partialize<P>>
  }
}
