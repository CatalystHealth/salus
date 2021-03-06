import { CallHandler, ExecutionContext, NestInterceptor } from '@nestjs/common'
import { Observable } from 'rxjs'
import { map } from 'rxjs/operators'

import { getOperation } from './utils'

export class SerializationInterceptor implements NestInterceptor {
  public intercept(
    context: ExecutionContext,
    next: CallHandler<any>
  ): Observable<any> | Promise<Observable<any>> {
    const operation = getOperation(context.getHandler())
    if (!operation) {
      return next.handle()
    }

    return next.handle().pipe(map((result) => operation.encodeResponse(result)))
  }
}
