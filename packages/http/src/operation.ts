import { Any, Codec, OutputOf, TypeOf, Unknown, ValidationFailedError } from '@salus-js/codec'
import { compile, PathFunction } from 'path-to-regexp'

import { Methods } from './types'

export interface OperationOptions<
  TParams extends Any = Unknown,
  TQuery extends Any = Unknown,
  TBody extends Any = Unknown,
  TResponse extends Any = Unknown
> {
  /**
   * Path for the request
   */
  readonly path: string
  /**
   * HTTP method on the request
   */
  readonly method: Methods
  /**
   * Summary of what this operation does
   */
  readonly summary?: string
  /**
   * Long form description of this operation's behavior
   */
  readonly description?: string
  /**
   * Tags associated with the operation
   */
  readonly tags?: string[]
  /**
   * Codec for path parameters
   */
  readonly params?: TParams
  /**
   * Codec for query parameters
   */
  readonly query?: TQuery
  /**
   * Codec for path parameters
   */
  readonly body?: TBody
  /**
   * Codec for response payload
   */
  readonly response: TResponse
  /**
   * Arbitrary additional properties for the operation
   */
  readonly extensions?: Record<string, unknown>
}

export class Operation<
  TParams extends Any = Unknown,
  TQuery extends Any = Unknown,
  TBody extends Any = Unknown,
  TResponse extends Any = Unknown
> {
  readonly _P!: TypeOf<TParams>
  readonly _Q!: TypeOf<TQuery>
  readonly _B!: TypeOf<TBody>
  readonly _R!: TypeOf<TResponse>

  private readonly compiledPath: PathFunction<any>

  constructor(public readonly options: OperationOptions<TParams, TQuery, TBody, TResponse>) {
    this.compiledPath = compile(options.path)
  }

  /**
   * Get a formatted path with the given parameters substituted in
   *
   * @param params the parameters to pass to the path
   * @returns the formatted path
   */
  public formatPath(params?: TypeOf<TParams>): string {
    return this.compiledPath(this.encodeParams(params))
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public encodeQuery(input: TypeOf<TQuery>): OutputOf<TQuery> {
    return this.options.query?.encode(input)
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public decodeQuery(input: unknown): TypeOf<TQuery> {
    return this.decodeOrFail(this.options.query, input, 'query')
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public encodeParams(input: TypeOf<TParams>): OutputOf<TParams> {
    return this.options.params?.encode(input)
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public decodeParams(input: unknown): TypeOf<TQuery> {
    return this.decodeOrFail(this.options.params, input, 'params')
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public encodeBody(input: TypeOf<TBody>): OutputOf<TBody> {
    return this.options.body?.encode(input)
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public decodeBody(input: unknown): TypeOf<TBody> {
    return this.decodeOrFail(this.options.body, input, 'body')
  }

  /**
   * Encodes the response to prepare for sending
   *
   * @param input the runtime-typed response value
   * @returns the encoded response value
   */
  public encodeResponse(response: TypeOf<TResponse>): OutputOf<TResponse> {
    return this.options.response.encode(response)
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public decodeResponse(response: TypeOf<TResponse>): OutputOf<TResponse> {
    const result = this.options.response.decode(response)
    if (!result.success) {
      throw new ValidationFailedError(result.errors, 'response')
    }

    return result.value
  }

  private decodeOrFail<O>(codec: Codec<any, O> | undefined, value: unknown, context: string): O {
    if (!codec || value === undefined) {
      return (undefined as unknown) as O
    }

    const result = codec.decode(value)
    if (!result.success) {
      throw new ValidationFailedError(result.errors, context)
    }

    return result.value
  }
}
