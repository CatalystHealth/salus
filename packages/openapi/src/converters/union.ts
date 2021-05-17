import { Codec, UnionCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'

export const UnionConverter = SimpleConverter.for(UnionCodec, (codec, visitor) => ({
  anyOf: (codec.codecs as Codec<any>[]).map((child) => visitor.convert(child))
}))
