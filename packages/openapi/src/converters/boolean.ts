import { BooleanCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const BooleanConverter = SimpleConverter.for(BooleanCodec, () => ({
  type: 'boolean'
}))
