import { Codec } from '../codec'
import { Context } from '../context'
import { Validation } from '../validation'

export class LazyCodec<A, O> extends Codec<A, O> {
  readonly _tag = 'LazyCodec' as const

  private internalCache: Codec<A, O> | null = null

  constructor(public readonly resolver: () => Codec<A, O>) {
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
}
