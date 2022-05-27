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

  const optionalCodec = new LazyCodec(() => new StringCodec())
    .optional()
    .document({ description: 'Blah blah' })

  executeDecodeTests([
    decodeSuccessExpectation('parse simple string', optionalCodec, 'one', 'one'),
    decodeSuccessExpectation('parse undefined', optionalCodec, undefined, undefined),
    decodeFailureExpectation('reject invalid values for inner codec', optionalCodec, 1, [
      '',
      'must be a string'
    ])
  ])
})
