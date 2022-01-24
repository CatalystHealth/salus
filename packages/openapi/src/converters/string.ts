import { StringCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'
import { mapRefinement } from './utils'

export const StringConverter = SimpleConverter.for(StringCodec, (codec) => ({
  type: 'string',
  ...(codec.notEmpty ? { minLength: 1 } : {}),
  ...mapRefinement<number>(codec, 'minLength', (minLength) => ({
    minLength
  })),
  ...mapRefinement<number>(codec, 'maxLength', (maxLength) => ({
    maxLength
  })),
  ...mapRefinement<RegExp>(codec, 'pattern', (pattern) => ({
    pattern: pattern.source
  }))
}))
