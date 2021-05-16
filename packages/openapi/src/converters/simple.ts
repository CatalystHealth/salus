import { BaseCodec, Codec } from '@salus-js/codec'

import { SchemaConverter } from '../converter'
import type { SchemaObject } from '../openapi'
import { SchemaVisitor } from '../visitor'

type Type<T> = new (...args: any[]) => T
type Handler<T> = (codec: T, visitor: SchemaVisitor) => SchemaObject

export class SimpleConverter<T extends Codec<any>> implements SchemaConverter {
  constructor(private readonly type: Type<T>, private readonly handler: Handler<T>) {}

  convert(codec: Codec<any, any>, visitor: SchemaVisitor, next: () => SchemaObject): SchemaObject {
    if (!(codec instanceof this.type)) {
      return next()
    }

    return this.applyBasicSchema(codec, this.handler(codec, visitor))
  }

  private applyBasicSchema(codec: Codec<any>, schema: SchemaObject): SchemaObject {
    if (codec instanceof BaseCodec) {
      if (codec.options.description && !schema.description) {
        schema.description = codec.options.description
      }

      if (codec.options.example && !schema.example) {
        schema.example = codec.encode(codec.options.example)
      }
    }

    return schema
  }

  public static for<T extends Codec<any>>(type: Type<T>, handler: Handler<T>): SimpleConverter<T> {
    return new SimpleConverter(type, handler)
  }
}
