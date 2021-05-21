import { Any, TypeOf } from '@salus-js/codec'
import { Operation } from '@salus-js/http'
import { default as axios, AxiosInstance, AxiosRequestConfig, AxiosResponse, Method } from 'axios'

type CustomizableOptions =
  | 'auth'
  | 'cancelToken'
  | 'timeout'
  | 'transformRequest'
  | 'transformResponse'
  | 'headers'
  | 'baseURL'

export interface RequestOptions<TParams, TQuery, TBody>
  extends Pick<AxiosRequestConfig, CustomizableOptions> {
  readonly params?: TParams
  readonly query?: TQuery
  readonly body?: TBody
}

export class HttpClient {
  public readonly axios: AxiosInstance

  private constructor(baseURL: string, options: AxiosRequestConfig = {}) {
    this.axios = axios.create({
      baseURL,
      ...options
    })
  }

  /**
   * Executes a Salus operation with the provided input
   *
   * @param operation the operation to execute
   * @param arguments options to pass down to the request
   * @returns
   */
  public async execute<
    TParams extends Any,
    TQuery extends Any,
    TBody extends Any,
    TResponse extends Any
  >(
    operation: Operation<TParams, TQuery, TBody, TResponse>,
    options?: RequestOptions<TypeOf<TParams>, TypeOf<TQuery>, TypeOf<TBody>>
  ): Promise<AxiosResponse<TypeOf<TResponse>>> {
    const { params: inputParams, query: inputQuery, body: inputBody, ...otherOptions } =
      options ?? {}
    const path = operation.formatPath(inputParams)
    const query = inputQuery ? operation.encodeQuery(inputQuery) : undefined
    const body = inputBody ? operation.encodeBody(inputBody) : undefined
    const response = await this.axios.request({
      ...otherOptions,
      url: path,
      method: operation.options.method as Method,
      params: query,
      data: body
    })

    return {
      ...response,
      data: operation.decodeResponse(response.data)
    }
  }

  public static create(baseURL: string, options: AxiosRequestConfig = {}): HttpClient {
    return new HttpClient(baseURL, options)
  }
}
