import { ReferenceCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const ReferenceConverter = SimpleConverter.for(ReferenceCodec, (codec, visitor) =>
  visitor.convert(codec.referenced)
)
