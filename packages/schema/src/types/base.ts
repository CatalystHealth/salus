import { Context } from '../context'
import { Constraint, Refinement, RefinementOptions } from '../refinement'
import { Validation, failure } from '../validation'

import { UnionSchema, NullSchema, OptionalSchema } from './internal'
import { Schema } from './schema'

type DocumentationOptions<A> = {
  description?: string
  example?: A
}

export type BaseOptions<A> = DocumentationOptions<A> & {
  name?: string
  refinements?: Refinement<A, any>[]
}

export abstract class BaseSchema<A, O = A> implements Schema<A, O> {
  constructor(public readonly options: BaseOptions<A> = {}) {}

  public is(value: unknown): value is A {
    if (!this.isInternal(value)) {
      return false
    }

    return (this.options.refinements || []).every((refinement) => {
      return refinement.constraint(value, refinement.arguments)
    })
  }

  public decode(value: unknown, context: Context): Validation<A> {
    const result = this.decodeInternal(value, context)
    if (!result.valid) {
      return result
    }

    for (const refinement of this.options.refinements || []) {
      if (!refinement.constraint(result.value, refinement.arguments)) {
        return failure(context, value, refinement.message)
      }
    }

    return result
  }

  abstract encode(value: A): O

  protected abstract isInternal(value: unknown): value is A

  protected abstract decodeInternal(value: unknown, context: Context): Validation<A>

  protected abstract with(options: BaseOptions<A>): BaseSchema<A, O>

  public optional(): OptionalSchema<A, O> {
    return new OptionalSchema(this)
  }

  public nullable(): UnionSchema<this | NullSchema> {
    return new UnionSchema([this, new NullSchema()])
  }

  public named(name: string): this {
    return this.with({
      ...this.options,
      name
    }) as this
  }

  public document(options: DocumentationOptions<A>): this {
    return this.with({
      ...this.options,
      ...options
    }) as this
  }

  /**
   * Adds a new refinement to the schema
   *
   * @param constraint the constraint to apply
   * @param options the options to attach with the constraint
   * @returns a new schema with the constraint applied
   */
  public refine(constraint: Constraint<A, void>, message: string): this
  public refine<P>(constraint: Constraint<A, P>, options: RefinementOptions<A, P>): this
  public refine<P>(constraint: Constraint<A, P>, options: string | RefinementOptions<A, P>): this {
    const overrideOptions =
      typeof options !== 'string'
        ? options
        : {
            message: options
          }

    return this.with({
      ...this.options,
      refinements: [
        ...(this.options.refinements || []),
        {
          constraint,
          ...overrideOptions
        }
      ]
    }) as this
  }
}
