import { Codec, ObjectCodec } from '@tsio/codec/src'

import { createSimpleConverter } from './simple'

export const ObjectConverter = createSimpleConverter(ObjectCodec, (codec, visitor) => ({
  type: 'object',
  properties: Object.fromEntries(
    Object.entries(codec.props).map(([key, child]) => [key, visitor.convert(child as Codec<any>)])
  )
}))
