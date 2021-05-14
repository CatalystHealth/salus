import { LiteralCodec } from '@tsio/codec/src'

import { createSimpleConverter } from './simple'

export const LiteralConverter = createSimpleConverter(LiteralCodec, (codec) => ({
  type: 'string',
  default: codec.value as string,
  enum: [codec.value],
  examples: [codec.value]
}))
