import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { LazyCodec } from './lazy'
import { StringCodec } from './string'

describe('Lazy Codec', () => {
  const codec = new LazyCodec(() => new StringCodec())

  executeDecodeTests([
    decodeSuccessExpectation('parse simple string', codec, 'one', 'one'),
    decodeFailureExpectation('reject invalid values for inner codec', codec, 1, [
      '',
      'must be a string'
    ])
  ])
})
