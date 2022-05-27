import { Codec } from '../codec'
import { Context } from '../context'
import { Validation } from '../validation'

import { CodecOptions } from './base'
import { NullableCodec } from './nullable'
import { OptionalCodec } from './optional'

export class LazyCodec<A, O> extends Codec<A, O> {
  readonly _tag = 'LazyCodec' as const

  private internalCache: Codec<A, O> | null = null

  constructor(public readonly resolver: () => Codec<A, O>, readonly options?: CodecOptions<A>) {
    super()
  }

  public get codec(): Codec<A, O> {
    if (this.internalCache) {
      return this.internalCache
    }

    return (this.internalCache = this.resolver())
  }

  public is(value: unknown, context: Context = Context.create(this)): value is A {
    return this.codec.is(value, context.replace(this.codec))
  }

  public encode(value: A, context: Context = Context.create(this)): O {
    return this.codec.encode(value, context.replace(this.codec))
  }

  public decode(value: unknown, context: Context = Context.create(this)): Validation<A> {
    return this.codec.decode(value, context.replace(this.codec))
  }

  public optional(): OptionalCodec<A, O> {
    return new OptionalCodec(this)
  }

  public nullable(): NullableCodec<A, O> {
    return new NullableCodec(this)
  }

  public document(
    options: Pick<CodecOptions<A>, 'title' | 'description' | 'example' | 'extensions'>
  ): this {
    return this.with({
      ...this.options,
      ...options
    }) as this
  }

  protected with(options: CodecOptions<A>): LazyCodec<A, O> {
    return new LazyCodec(this.resolver, options)
  }
}
