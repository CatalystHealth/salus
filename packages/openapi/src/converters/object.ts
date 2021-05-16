import { Codec, ObjectCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const ObjectConverter = SimpleConverter.for(ObjectCodec, (codec, visitor) => ({
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(codec.props).map(([key, child]) => [key, visitor.convert(child as Codec<any>)])
  ),
  required: [...codec.requiredProperties]
}))
