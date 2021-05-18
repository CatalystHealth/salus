import { UnknownCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const UnknownConverter = SimpleConverter.for(UnknownCodec, () => ({
  type: 'object',
  additionalProperties: {
    type: 'object'
  }
}))
