import {
  Post,
  createParamDecorator,
  ExecutionContext,
  Get,
  Put,
  Delete,
  Patch
} from '@nestjs/common'
import { Codec, ValidationFailedError } from '@salus-js/codec'
import { Operation as ApiOperation } from '@salus-js/openapi'
import { Request } from 'express'

import { OPERATION_METADATA_KEY } from './constants'

function decodeIfNecessary<A>(codec: Codec<A, any> | undefined, value: unknown): A | null {
  if (!codec) {
    return null
  }

  const result = codec.decode(value)
  if (!result.success) {
    throw new ValidationFailedError(result.errors)
  }

  return result.value
}

/* eslint-disable @typescript-eslint/ban-types, @typescript-eslint/no-unsafe-call */
export function Operation(operation: ApiOperation): MethodDecorator {
  let decoratorFactory: (path: string) => MethodDecorator
  switch (operation.opts.method) {
    case 'GET':
      decoratorFactory = Get
      break
    case 'POST':
      decoratorFactory = Post
      break
    case 'PUT':
      decoratorFactory = Put
      break
    case 'DELETE':
      decoratorFactory = Delete
      break
    case 'PATCH':
      decoratorFactory = Patch
      break
    default:
      throw new Error(`Unknown HTTP method: ${operation.opts.method}`)
  }

  const decorator = decoratorFactory(operation.opts.path)
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
  const operation = Reflect.getMetadata(OPERATION_METADATA_KEY, ctx.getHandler()) as ApiOperation
  const body = decodeIfNecessary(operation.opts.body, request.body)
  const params = decodeIfNecessary(operation.opts.params, request.params)
  const query = decodeIfNecessary(operation.opts.query, request.query)

  return {
    body,
    params,
    query
  }
})
