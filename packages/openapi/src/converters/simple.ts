import { Codec } from '@salus-js/codec'

import { SchemaConverter } from '../converter'
import type { ReferenceObject, SchemaObject } from '../openapi'
import { SchemaVisitor } from '../visitor'

type Type<T> = new (...args: any[]) => T
type Handler<T> = (codec: T, visitor: SchemaVisitor) => SchemaObject | ReferenceObject

export class SimpleConverter<T extends Codec<any>> implements SchemaConverter {
  constructor(private readonly type: Type<T>, private readonly handler: Handler<T>) {}

  convert(
    codec: Codec<any, any>,
    visitor: SchemaVisitor,
    next: () => SchemaObject | ReferenceObject
  ): SchemaObject | ReferenceObject {
    if (!(codec instanceof this.type)) {
      return next()
    }

    return this.handler(codec, visitor)
  }

  public static for<T extends Codec<any>>(type: Type<T>, handler: Handler<T>): SimpleConverter<T> {
    return new SimpleConverter(type, handler)
  }
}
