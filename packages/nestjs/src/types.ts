import { Operation } from '@salus-js/openapi'

export type OperationResult<T extends Operation> = T extends Operation<any, any, any, infer TResult>
  ? TResult
  : never

export type OperationParams<T extends Operation> = T extends Operation<infer TParams, any, any, any>
  ? TParams
  : never

export type OperationQuery<T extends Operation> = T extends Operation<any, infer TQuery, any, any>
  ? TQuery
  : never

export type OperationBody<T extends Operation> = T extends Operation<any, any, infer TBody, any>
  ? TBody
  : never

export type InputOf<T extends Operation> = {
  params: OperationParams<T>
  query: OperationQuery<T>
  body: OperationBody<T>
}

export type OutputOf<T extends Operation> = OperationResult<T> | Promise<OperationResult<T>>
