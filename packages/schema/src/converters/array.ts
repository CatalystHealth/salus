import { ArrayCodec } from '@tsio/codec/src'

import { createSimpleConverter } from './simple'

export const ArrayConverter = createSimpleConverter(ArrayCodec, (codec, visitor) => ({
  type: 'array',
  items: visitor.convert(codec.itemCodec)
}))
