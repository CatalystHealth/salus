import { Any, Undefined, Unknown } from '@salus-js/codec'

import { Operation, OperationOptions } from './operation'
import { Methods } from './types'

export type OperationWithoutBodyFactory = <
  TParams extends Any = Undefined,
  TQuery extends Any = Undefined,
  TResponse extends Any = Unknown
>(
  path: string,
  options: Omit<OperationOptions<TParams, TQuery, Undefined, TResponse>, 'path' | 'method' | 'body'>
) => Operation<TParams, TQuery, Undefined, TResponse>

export type OperationWithBodyFactory = <
  TParams extends Any = Undefined,
  TQuery extends Any = Undefined,
  TBody extends Any = Undefined,
  TResponse extends Any = Unknown
>(
  path: string,
  options: Omit<OperationOptions<TParams, TQuery, TBody, TResponse>, 'path' | 'method'>
) => Operation<TParams, TQuery, TBody, TResponse>

export function createOperationHandler(method: Methods, body: true): OperationWithBodyFactory
export function createOperationHandler(method: Methods, body: false): OperationWithoutBodyFactory
export function createOperationHandler(
  method: Methods
): OperationWithBodyFactory | OperationWithoutBodyFactory {
  return <
    TParams extends Any = Undefined,
    TQuery extends Any = Undefined,
    TBody extends Any = Undefined,
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
