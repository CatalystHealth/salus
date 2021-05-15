import { ArrayCodec } from '@salus-js/codec'

import { createSimpleConverter } from './simple'

export const ArrayConverter = createSimpleConverter(ArrayCodec, (codec, visitor) => ({
  type: 'array',
  items: visitor.convert(codec.itemCodec)
}))
