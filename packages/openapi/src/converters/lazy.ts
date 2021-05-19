import { LazyCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const LazyConverter = SimpleConverter.for(LazyCodec, (codec, visitor) =>
  visitor.convert(codec.codec)
)
