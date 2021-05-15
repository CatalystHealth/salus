import { NumberCodec } from '@salus-js/codec'

import { createSimpleConverter } from './simple'

export const NumberConverter = createSimpleConverter(NumberCodec, () => ({
  type: 'number'
}))
