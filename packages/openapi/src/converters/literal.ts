import { LiteralCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const LiteralConverter = SimpleConverter.for(LiteralCodec, (codec) => ({
  type: 'string',
  default: codec.value as string,
  enum: [codec.value],
  example: codec.value
}))
