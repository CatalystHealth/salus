import { IsoDateTimeCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const IsoDateTimeConverter = SimpleConverter.for(IsoDateTimeCodec, () => ({
  type: 'string',
  format: 'date-time'
}))
