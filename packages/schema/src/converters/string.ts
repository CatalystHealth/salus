import { StringCodec } from '@tsio/codec'

import { createSimpleConverter } from './simple'

export const StringConverter = createSimpleConverter(StringCodec, () => ({
  type: 'string'
}))
