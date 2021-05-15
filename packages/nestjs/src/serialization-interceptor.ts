import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Operation } from '@tsio/openapi'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { OPERATION_METADATA_KEY } from './constants'

export class SerializationInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const handler = context.getHandler()
    const operation = Reflect.getMetadata(OPERATION_METADATA_KEY, handler) as Operation | null
    if (!operation) {
      return next.handle()
    }

    const responseEncoder = operation.opts.response

    return next.handle().pipe(map((result) => responseEncoder.encode(result)))
  }
}
