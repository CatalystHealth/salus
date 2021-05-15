import * as io from '@salus-js/codec'

interface OperationExample<TContent> {
  name: string
  content: TContent
}

interface OperationOptions<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown,
  TResponse = unknown
> {
  readonly path: string
  readonly method: string
  readonly description?: string
  readonly tags?: string[]
  readonly params?: io.Codec<TParams, unknown>
  readonly query?: io.Codec<TQuery, unknown>
  readonly body?: io.Codec<TBody, unknown>
  readonly response: io.Codec<TResponse, unknown>
  readonly requestExamples?: OperationExample<TBody>[]
  readonly responseExamples?: OperationExample<TResponse>[]
}

interface OperationArguments<TParams = unknown, TQuery = unknown, TBody = unknown> {
  readonly params: TParams
  readonly query: TQuery
  readonly body: TBody
}

type UnsafeOperationArguments = OperationArguments<unknown, unknown, unknown>

type SafeOperationArguments<
  TParams = unknown,
  TQuery = unknown,
  TBody = unknown
> = OperationArguments<TParams, TQuery, TBody>

export class Operation<TParams = unknown, TQuery = unknown, TBody = unknown, TResponse = unknown> {
  constructor(public readonly opts: OperationOptions<TParams, TQuery, TBody, TResponse>) {}

  public validate(
    unsafe: UnsafeOperationArguments
  ): SafeOperationArguments<TParams, TQuery, TBody> {
    return {
      params: this.decodeOrFail(this.opts.params, unsafe.params),
      query: this.decodeOrFail(this.opts.query, unsafe.query),
      body: this.decodeOrFail(this.opts.body, unsafe.body)
    }
  }

  public encode(value: TResponse): unknown {
    return this.opts.response.encode(value)
  }

  private decodeOrFail<T>(codec: io.Codec<T, unknown> | undefined, value: unknown): T {
    if (!codec) {
      return (null as unknown) as T
    }

    const result = codec.decode(value)
    if (!result.success) {
      throw new Error('Failed')
    }
    return result.value
  }
}

function createOperation<TParams, TQuery, TBody, TResponse>(
  options: OperationOptions<TParams, TQuery, TBody, TResponse>
): Operation<TParams, TQuery, TBody, TResponse> {
  return new Operation({
    ...options
  })
}

function buildOperationFactory(method: string) {
  return <TParams = unknown, TQuery = unknown, TBody = never, TResponse = unknown>(
    path: string,
    options: Omit<OperationOptions<TParams, TQuery, TBody, TResponse>, 'path' | 'method'>
  ) => {
    return createOperation({
      method,
      path,
      ...options
    })
  }
}

export const getOperation = buildOperationFactory('GET')
export const postOperation = buildOperationFactory('POST')
export const putOperation = buildOperationFactory('PUT')
export const deleteOperation = buildOperationFactory('DELETE')
export const patchOperation = buildOperationFactory('PATCH')
