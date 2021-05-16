import { ArrayCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'
import { mapRefinement } from './utils'

export const ArrayConverter = SimpleConverter.for(ArrayCodec, (codec, visitor) => ({
  type: 'array',
  items: visitor.convert(codec.itemCodec),
  ...mapRefinement<number>(codec, 'minItems', (minItems) => ({
    minItems
  })),
  ...mapRefinement<number>(codec, 'maxItems', (maxItems) => ({
    maxItems
  }))
}))
