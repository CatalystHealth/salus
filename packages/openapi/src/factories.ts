import { Operation } from '@salus-js/http'

import { RequestBodyObject, ResponsesObject } from './openapi'
import { SchemaVisitor } from './visitor'

export type RequestFactory = (operation: Operation, visitor: SchemaVisitor) => RequestBodyObject
export type ResponseFactory = (operation: Operation, visitor: SchemaVisitor) => ResponsesObject

export function createJsonResponseFactory(): ResponseFactory {
  return (operation, visitor) => ({
    default: {
      description: 'Successful response.',
      content: {
        'application/json': {
          schema: visitor.convert(operation.options.response)
        }
      }
    }
  })
}

export function createRequestFactory(): RequestFactory {
  return (operation, visitor) => {
    const contentType = operation.options.contentType ?? 'application/json'
    return {
      content: {
        [contentType]: {
          schema: operation.options.body ? visitor.convert(operation.options.body) : {}
        }
      }
    }
  }
}
