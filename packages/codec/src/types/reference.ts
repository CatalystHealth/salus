import { Codec } from '../codec'
import { Context } from '../context'
import { Validation } from '../validation'

import { BaseCodec, CodecOptions } from './'

export interface ReferenceCodecOptions<A> extends CodecOptions<A> {
  /**
   * Description of the purpose of this codec
   */
  readonly description?: string

  /**
   * Exmaple of a typical value associated with this codec
   */
  readonly example?: A
}

export class ReferenceCodec<A, O> extends BaseCodec<A, O> {
  readonly _tag = 'ReferenceCodec' as const

  constructor(
    public readonly referenced: Codec<A, O>,
    public readonly options: ReferenceCodecOptions<A> = {}
  ) {
    super(options)
  }

  protected doIs(value: unknown, context: Context): value is A {
    return this.referenced.is(value, context.replace(this.referenced))
  }

  protected doEncode(value: A, context: Context): O {
    return this.referenced.encode(value, context.replace(this.referenced))
  }

  protected doDecode(value: unknown, context: Context): Validation<A> {
    return this.referenced.decode(value, context.replace(this.referenced))
  }

  protected with(options: CodecOptions<A>): ReferenceCodec<A, O> {
    return new ReferenceCodec(this, options)
  }

  public document(
    options: Pick<ReferenceCodecOptions<A>, 'description' | 'example'>
  ): ReferenceCodec<A, O> {
    return new ReferenceCodec(this.referenced, options)
  }
}
