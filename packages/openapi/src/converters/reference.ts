import { ReferenceCodec } from '@salus-js/codec'

import { isSchemaObject } from '../openapi'

import { SimpleConverter } from './simple'

export const ReferenceConverter = SimpleConverter.for(ReferenceCodec, (codec, visitor) => {
  const referencedSchema = visitor.convert(codec.referenced)
  const schema = isSchemaObject(referencedSchema)
    ? referencedSchema
    : {
        oneOf: [referencedSchema]
      }

  if (codec.options.description) {
    schema.description = codec.options.description
  }

  if (codec.options.example) {
    schema.example = codec.options.example
  }

  return schema
})
