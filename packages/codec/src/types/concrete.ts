import { Codec } from '../codec'
import { Context } from '../context'
import { Constraint, RefinementOptions } from '../refinement'
import { Validation } from '../validation'

import { CodecOptions } from './base'

import { NullableCodec, OptionalCodec, ReferenceCodec } from './'

export class ConcreteCodec<A, O> extends Codec<A, O> {
  readonly _tag = 'ConcreteCodec' as const

  constructor(public readonly name: string, public readonly referenced: Codec<A, O>) {
    super()
  }

  public is(value: unknown, context: Context = Context.create(this)): value is A {
    return this.referenced.is(value, context.replace(this.referenced))
  }

  public encode(value: A, context: Context = Context.create(this)): O {
    return this.referenced.encode(value, context.replace(this.referenced))
  }

  public decode(value: unknown, context: Context = Context.create(this)): Validation<A> {
    return this.referenced.decode(value, context.replace(this.referenced))
  }

  public optional(): OptionalCodec<A, O> {
    return new OptionalCodec(this)
  }

  public nullable(): NullableCodec<A, O> {
    return new NullableCodec(this)
  }

  public document(options: Pick<CodecOptions<A>, 'description' | 'example'>): ReferenceCodec<A, O> {
    return new ReferenceCodec(this, options)
  }

  public refine<P>(
    constraint: Constraint<A, P>,
    options: string | RefinementOptions<A, P>
  ): ReferenceCodec<A, O> {
    return new ReferenceCodec(this).refine(constraint, options)
  }
}
