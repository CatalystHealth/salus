import { EnumCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const EnumConverter = SimpleConverter.for(EnumCodec, (codec) => ({
  type: 'string',
  enum: [...codec.enumValues]
}))
