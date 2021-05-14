import { StringCodec } from '@tsio/codec/src'

import { createSimpleConverter } from './simple'

export const StringConverter = createSimpleConverter(StringCodec, () => ({
  type: 'string'
}))
