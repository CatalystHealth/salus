import { Operation } from '@salus-js/http'

import { ReferenceObject, RequestBodyObject, ResponsesObject, SchemaObject } from './openapi'

export type RequestFactory = (
  operation: Operation,
  response: SchemaObject | ReferenceObject
) => RequestBodyObject
export type ResponseFactory = (
  operation: Operation,
  request: SchemaObject | ReferenceObject
) => ResponsesObject

export function createResponseFactory(defaultContentType: string): ResponseFactory {
  return (_operation, response) => ({
    default: {
      description: 'Successful response.',
      content: {
        [defaultContentType]: {
          schema: response
        }
      }
    }
  })
}

export function createRequestFactory(defaultContentType: string): RequestFactory {
  return (_operation, response) => ({
    content: {
      [defaultContentType]: {
        schema: response
      }
    }
  })
}
