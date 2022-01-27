import { Codec } from '../codec'
import { Context } from '../context'
import { Preprocessor } from '../preprocess'
import { Constraint, Refinement, RefinementOptions } from '../refinement'
import { failure, Validation } from '../validation'

import { NullableCodec, OptionalCodec } from './'

const emptyRefinements: Refinement<any, any>[] = []
const emptyProcessors: Preprocessor[] = []

export interface CodecOptions<A> {
  /**
   * Title to apply to this codec
   */
  readonly title?: string
  /**
   * Description of the purpose of this codec
   */
  readonly description?: string
  /**
   * Exmaple of a typical value associated with this codec
   */
  readonly example?: A
  /**
   * Array of all refinements to apply to the codec
   */
  readonly refinements?: Refinement<A, any>[]
  /**
   * Array of all preprocessors on the codec
   */
  readonly preprocessors?: Preprocessor[]
  /**
   * Arbitrary additional data to attach to the codec
   */
  readonly extensions?: Record<string, unknown>
}

export abstract class BaseCodec<A, O = A> extends Codec<A, O> {
  constructor(readonly options: CodecOptions<A> = {}) {
    super()
  }

  public is(value: unknown, context: Context = Context.create(this)): value is A {
    if (!this.doIs(value, context)) {
      return false
    }

    return (this.options.refinements || emptyRefinements).every(({ constraint, arguments: args }) =>
      constraint(value, args)
    )
  }

  public encode(value: A, context: Context = Context.create(this)): O {
    return this.doEncode(value, context)
  }

  public decode(value: unknown, context: Context = Context.create(this)): Validation<A> {
    const valueToProcess = (this.options.preprocessors ?? emptyProcessors).reduce(
      (value, processor) => processor(value),
      value
    )

    const result = this.doDecode(valueToProcess, context)
    if (!result.success) {
      return result
    }

    for (const refinement of this.options.refinements || emptyRefinements) {
      if (!refinement.constraint(result.value, refinement.arguments)) {
        return failure(context, value, refinement.message || 'invalid')
      }
    }

    return result
  }

  /**
   * Builds a new codec with an additional refinement applied
   *
   * @param constraint the constraint to apply to the codec
   * @param options the options to attach with the constraint
   * @returns a new codec with the refinement applied
   */
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
        ...(this.options.refinements || emptyRefinements),
        {
          constraint,
          ...overrideOptions
        }
      ]
    }) as this
  }

  /**
   * Builds a new codec with an additional preprocessor applied
   *
   * @param processor the preprocessor to add to the list
   * @returns a new codec with the processor applied
   */
  public preprocess(processor: Preprocessor): this {
    return this.with({
      ...this.options,
      preprocessors: [...(this.options.preprocessors || emptyProcessors), processor]
    }) as this
  }

  /**
   * Attach documentation information to this codec, creating a new instance.
   *
   * @param options the new options to attach to the codec
   * @returns a new codec with the attached options
   */
  public document(
    options: Pick<CodecOptions<A>, 'title' | 'description' | 'example' | 'extensions'>
  ): this {
    return this.with({
      ...this.options,
      ...options
    }) as this
  }

  /**
   * Creates a new codec that allows an optional value
   *
   * @returns a new codec which allows the property to be optional
   */
  public optional(): OptionalCodec<A, O> {
    return new OptionalCodec(this)
  }

  /**
   * Creates a new codec that allows a null value
   *
   * @returns a new codec which allows the property to be optional
   */
  public nullable(): NullableCodec<A, O> {
    return new NullableCodec(this)
  }

  /**
   * Must be overridden by implementations. Checks that the value conforms to the runtime type.
   *
   * This method only needs to check the type requirements of the codec. Refinements will be
   * checked automatically by BaseCodec.
   *
   * @param value the value to check
   * @param context the context of the `.is()` call
   */
  protected abstract doIs(value: unknown, context: Context): value is A

  /**
   * Must be overridden by implementations. Encodes a value to its runtime type.
   *
   * @param value the value to encode
   * @param context the context of the `.encode()` call
   */
  protected abstract doEncode(value: A, context: Context): O

  /**
   * Must be overridden by implementations. Decodes the value to a runtime type.
   *
   * This method only needs to check the type requirements of the codec. Refinements will be
   * checked automatically by BaseCodec.
   *
   * @param value the value to check
   * @param context the context of the `.is()` call
   */
  protected abstract doDecode(value: unknown, context: Context): Validation<A>

  /**
   * Must be overriden by implementations. Creates a new instance of the codec with override options.
   *
   * @param options the new options to set on the codec
   * @returns a new codec with the updated options
   */
  protected abstract with(options: CodecOptions<A>): BaseCodec<A, O>
}
