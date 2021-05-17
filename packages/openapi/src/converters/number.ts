import { NumberCodec } from '@salus-js/codec'

import { SimpleConverter } from './simple'
import { mapRefinement } from './utils'

export const NumberConverter = SimpleConverter.for(NumberCodec, (codec) => ({
  type: 'number',
  ...mapRefinement<number>(codec, 'min', (min) => ({
    minimum: min
  })),
  ...mapRefinement<number>(codec, 'max', (max) => ({
    maximum: max
  })),
  ...mapRefinement<number>(codec, 'multipleOf', (multipleOf) => ({
    multipleOf
  }))
}))
