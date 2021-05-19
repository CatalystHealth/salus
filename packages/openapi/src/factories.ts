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

export function createJsonRequestFactory(): RequestFactory {
  return (operation, visitor) => ({
    content: {
      'application/json': {
        schema: operation.options.body ? visitor.convert(operation.options.body) : {}
      }
    }
  })
}

export function createFormRequestFactory(): RequestFactory {
  return (operation, visitor) => {
    return {
      content: {
        'application/x-www-form-urlencoded': {
          schema: operation.options.body ? visitor.convert(operation.options.body) : {}
        }
      }
    }
  }
}
