import { StringCodec } from '@salus-js/codec'

import { createSimpleConverter } from './simple'

export const StringConverter = createSimpleConverter(StringCodec, () => ({
  type: 'string'
}))
