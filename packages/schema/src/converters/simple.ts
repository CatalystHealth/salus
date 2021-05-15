import { BaseCodec, Codec } from '@salus-js/codec'

import { SchemaConverter } from '../converter'
import type { JSONSchema7 } from '../definition'
import { SchemaVisitor } from '../visitor'

type Type<T> = new (...args: any[]) => T

export function createSimpleConverter<T>(
  type: Type<T>,
  handler: (codec: T, visitor: SchemaVisitor) => JSONSchema7
): SchemaConverter {
  function extractBasicSchema(codec: Codec<any>): JSONSchema7 {
    const schema: JSONSchema7 = {}

    if (codec instanceof BaseCodec) {
      if (codec.options.description) {
        schema.description = codec.options.description
      }

      if (codec.options.example) {
        schema.examples = [codec.encode(codec.options.example)]
      }
    }

    return schema
  }

  return {
    convert: (codec, visitor, next) => {
      if (!(codec instanceof type)) {
        return next()
      }

      const basic = extractBasicSchema(codec)
      const converted = handler(codec, visitor)

      return {
        ...basic,
        ...converted
      }
    }
  }
}
