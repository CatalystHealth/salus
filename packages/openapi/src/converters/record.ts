import { RecordCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const RecordConverter = SimpleConverter.for(RecordCodec, (codec, visitor) => ({
  type: 'object',
  additionalProperties: visitor.convert(codec.valueCodec)
}))
