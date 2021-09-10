import {
  Post,
  createParamDecorator,
  ExecutionContext,
  Get,
  Put,
  Delete,
  Patch
} from '@nestjs/common'
import { Methods, Operation as ApiOperation } from '@salus-js/http'
import type { Request } from 'express'

import { OPERATION_METADATA_KEY } from './constants'
import { getOperation } from './utils'

type DecoratorsMap = { [K in Methods]: (path: string) => MethodDecorator }
const decoratorsMap: DecoratorsMap = {
  get: Get,
  post: Post,
  put: Put,
  delete: Delete,
  patch: Patch
}

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-unsafe-call */
export function Operation(operation: ApiOperation<any, any, any, any>): MethodDecorator {
  const decoratorFactory = decoratorsMap[operation.options.method]
  const decorator = decoratorFactory(operation.options.path)

  return <T>(
    target: Object,
    propertyKey: string | symbol,
    descriptor: TypedPropertyDescriptor<T>
  ): TypedPropertyDescriptor<T> | void => {
    Reflect.defineMetadata(
      OPERATION_METADATA_KEY,
      operation,
      (target as Record<string | symbol, unknown>)[propertyKey as string] as Object
    )

    return decorator(target, propertyKey, descriptor)
  }
}

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-unsafe-call */
export const Input = createParamDecorator((_data: void, ctx: ExecutionContext) => {
  const request: Request = ctx.switchToHttp().getRequest<Request>()
  const operation = getOperation(ctx.getHandler())
  if (!operation) {
    throw new Error('Attempting to use @Input() on an non-operation controller')
  }

  // If file(s) are on the request push them to the request body
  const file = request.file ? {file: request.file} : undefined
  const files = request.files ? {files: request.files} : undefined
  const body = operation.decodeBody({...request.body, ...file, ...files})

  const params = operation.decodeParams(request.params)
  const query = operation.decodeQuery(request.query)

  return {
    body,
    params,
    query
  }
})
