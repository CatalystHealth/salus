import { Context } from '../context'
import { OutputOf, TypeOf } from '../types'
import { failure, ValidationError, Validation, failures, success } from '../validation'

import { BaseOptions, BaseSchema } from './internal'
import { OptionalSchema } from './optional'
import { Schema } from './schema'

export type Props = {
  [key: string]: Schema<unknown>
}

export type TypeOfProps<P extends Props> = {
  [K in RequiredKeys<P>]: TypeOf<P[K]>
} &
  {
    [K in OptionalKeys<P>]?: TypeOf<P[K]>
  }

export type OutputOfProps<P extends Props> = {
  [K in RequiredKeys<P>]: OutputOf<P[K]>
} &
  {
    [K in OptionalKeys<P>]?: OutputOf<P[K]>
  }

type OptionalKeys<T extends Record<string, unknown>> = {
  [k in keyof T]: T[k] extends OptionalSchema<any, any> ? k : never
}[keyof T]

type RequiredKeys<T extends Record<string, unknown>> = Exclude<keyof T, OptionalKeys<T>>

export class ObjectSchema<P extends Props> extends BaseSchema<TypeOfProps<P>, OutputOfProps<P>> {
  public readonly properties: Set<string>
  public readonly requiredProperties: Set<string>

  constructor(public readonly props: P, options: BaseOptions<TypeOfProps<P>> = {}) {
    super(options)

    // Cache the well-known set of keys
    const cachedKeys = Object.keys(props)
    this.properties = new Set([...cachedKeys])
    this.requiredProperties = new Set([
      ...cachedKeys.filter((key) => !(props[key] instanceof OptionalSchema))
    ])
  }

  /**
   * Validates if the value conforms to the expected runtime type
   *
   * @param value
   * @returns
   */
  protected isInternal(value: unknown): value is TypeOfProps<P> {
    return typeof value === 'string'
  }

  /**
   * Attempts to decode the value
   *
   * @param value the value to decode
   * @param context the decoding context
   * @returns the validation result
   */
  protected decodeInternal(value: unknown, context: Context): Validation<TypeOfProps<P>> {
    if (!value || typeof value !== 'object') {
      return failure(context, value, 'must be an object')
    }

    const requiredKeys: Set<string> = new Set([...this.requiredProperties])
    const castValue = value as Record<string, unknown>
    const output: Record<string, unknown> = {}
    const errors: ValidationError[] = []
    for (const key of Object.keys(castValue)) {
      const schema = this.props[key]
      const result = schema.decode(castValue[key], context.enter(key, schema))

      if (!result.valid) {
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

  /**
   * Encodes the value
   *
   * @param value the value to encode
   * @returns the encoded value
   */
  public encode(value: TypeOfProps<P>): OutputOfProps<P> {
    const castValue = value as Record<string, unknown>
    const output: Record<string, unknown> = {}
    const providedKeys = Object.keys(value)

    for (const key of providedKeys) {
      const schema = this.props[key]
      output[key] = schema.encode(castValue[key])
    }

    return output as OutputOfProps<P>
  }

  public omit<T extends keyof P>(keys: T[]): ObjectSchema<Omit<P, T>> {
    const newProps = { ...this.props }
    for (const key of keys) {
      delete newProps[key]
    }

    return new ObjectSchema(newProps as Omit<P, T>)
  }

  public extend<T extends Props>(props: T): ObjectSchema<P & T> {
    return new ObjectSchema({
      ...this.props,
      ...props
    })
  }

  // Override

  protected with(options: BaseOptions<TypeOfProps<P>>): ObjectSchema<P> {
    return new ObjectSchema(this.props, options)
  }
}
