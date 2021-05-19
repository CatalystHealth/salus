import { OptionalCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const OptionalConverter = SimpleConverter.for(OptionalCodec, (codec, visitor) =>
  visitor.convert(codec.innerCodec)
)
