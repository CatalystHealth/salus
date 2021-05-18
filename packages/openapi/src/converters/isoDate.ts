import { IsoDateCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const IsoDateConverter = SimpleConverter.for(IsoDateCodec, () => ({
  type: 'string',
  format: 'date'
}))
