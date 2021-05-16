import { DateCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const DateConverter = SimpleConverter.for(DateCodec, () => ({
  type: 'string',
  format: 'date-time'
}))
