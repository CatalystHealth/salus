import { Codec, ObjectCodec } from '@salus-js/codec'

import { SchemaObject } from '../openapi'

import { SimpleConverter } from './simple'

export const ObjectConverter = SimpleConverter.for(ObjectCodec, (codec, visitor) => {
  const schema: SchemaObject = {
    type: 'object',
    properties: Object.fromEntries(
      Object.entries(codec.props).map(([key, child]) => [key, visitor.convert(child as Codec<any>)])
    )
  }

  if (codec.requiredProperties.size > 0) {
    schema.required = [...codec.requiredProperties]
  }

  return schema
})
