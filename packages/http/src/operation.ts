import { Any, Codec, OutputOf, TypeOf, Unknown, ValidationFailedError } from '@salus-js/codec'

interface RequestAttributes<TParams, TQuery, TBody> {
  readonly params: TParams | undefined
  readonly query: TQuery | undefined
  readonly body: TBody | undefined
}

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
  readonly method: string
  /**
   * Summary of what this operation does
   */
  readonly summary?: string
  /**
   * Long form description of this operation's behavior
   */
  readonly description?: string
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
}

export class Operation<
  TParams extends Any = Unknown,
  TQuery extends Any = Unknown,
  TBody extends Any = Unknown,
  TResponse extends Any = Unknown
> {
  readonly _P!: TypeOf<TParams>
  readonly _Q!: TypeOf<TQuery>
  readonly _B!: TypeOf<TQuery>
  readonly _R!: TypeOf<TResponse>

  constructor(public readonly options: OperationOptions<TParams, TQuery, TBody, TResponse>) {}

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public encodeRequest(
    input: RequestAttributes<TypeOf<TParams>, TypeOf<TQuery>, TypeOf<TBody>>
  ): RequestAttributes<OutputOf<TParams>, OutputOf<TQuery>, OutputOf<TBody>> {
    function encodeIfRequired<T, O>(codec?: Codec<T, O>, value?: T): O | undefined {
      if (!codec || !value) {
        return undefined
      }

      return codec.encode(value)
    }

    return {
      params: encodeIfRequired(this.options.params, input.params),
      query: encodeIfRequired(this.options.query, input.query),
      body: encodeIfRequired(this.options.body, input.body)
    }
  }

  /**
   * Encodes the request arguments to prepare them for serialization
   *
   * @param input the runtime-typed request arguments
   * @returns the encoded request arguments
   */
  public decodeRequest(
    input: RequestAttributes<unknown, unknown, unknown>
  ): RequestAttributes<TypeOf<TParams>, TypeOf<TQuery>, TypeOf<TBody>> {
    function decodeIfRequired<T, O>(
      codec?: Codec<T, O>,
      value?: unknown,
      context?: string
    ): T | undefined {
      if (!codec || !value) {
        return undefined
      }

      const result = codec.decode(value)
      if (!result.success) {
        throw new ValidationFailedError(result.errors, context)
      }

      return result.value
    }

    return {
      params: decodeIfRequired(this.options.params, input.params, 'params'),
      query: decodeIfRequired(this.options.query, input.query, 'query'),
      body: decodeIfRequired(this.options.body, input.body, 'body')
    }
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
}
