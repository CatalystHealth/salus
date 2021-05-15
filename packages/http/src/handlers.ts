import { Any, Unknown } from '@salus-js/codec'

import { Operation, OperationOptions } from './operation'

export type OperationWithoutBodyFactory = <
  TParams extends Any = Unknown,
  TQuery extends Any = Unknown,
  TResponse extends Any = Unknown
>(
  path: string,
  options: Omit<OperationOptions<TParams, TQuery, never, TResponse>, 'path' | 'method' | 'body'>
) => Operation<TParams, TQuery, never, TResponse>

export type OperationWithBodyFactory = <
  TParams extends Any = Unknown,
  TQuery extends Any = Unknown,
  TBody extends Any = Unknown,
  TResponse extends Any = Unknown
>(
  path: string,
  options: Omit<OperationOptions<TParams, TQuery, TBody, TResponse>, 'path' | 'method'>
) => Operation<TParams, TQuery, TBody, TResponse>

export function createOperationHandler(method: string, body: true): OperationWithBodyFactory
export function createOperationHandler(method: string, body: false): OperationWithoutBodyFactory
export function createOperationHandler(
  method: string
): OperationWithBodyFactory | OperationWithoutBodyFactory {
  return <
    TParams extends Any = Unknown,
    TQuery extends Any = Unknown,
    TBody extends Any = Unknown,
    TResponse extends Any = Unknown
  >(
    path: string,
    options: Omit<OperationOptions<TParams, TQuery, TBody, TResponse>, 'path' | 'method'>
  ) =>
    new Operation({
      path,
      method,
      ...options
    }) as any
}

export const http = {
  get: createOperationHandler('get', false),
  put: createOperationHandler('put', true),
  post: createOperationHandler('post', true),
  patch: createOperationHandler('patch', false),
  delete: createOperationHandler('delete', false)
}
