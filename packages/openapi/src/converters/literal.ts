import { LiteralCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const LiteralConverter = SimpleConverter.for(LiteralCodec, (codec) => ({
  type: 'string',
  default: codec.value,
  enum: [codec.value],
  example: codec.value
}))
