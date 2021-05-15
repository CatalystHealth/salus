import { DateCodec } from '@salus-js/codec'

import { createSimpleConverter } from './simple'

export const DateConverter = createSimpleConverter(DateCodec, () => ({
  type: 'string',
  format: 'date-time'
}))
