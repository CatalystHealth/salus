import { BodyOf, Operation, ParamsOf, QueryOf, ResponseOf } from '@salus-js/http'

export type InputOf<T extends Operation<any, any, any, any>> = {
  readonly params: ParamsOf<T>
  readonly body: BodyOf<T>
  readonly query: QueryOf<T>
}

export type OutputOf<T extends Operation<any, any, any, any>> = ResponseOf<T>
