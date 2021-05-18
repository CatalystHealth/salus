import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { BooleanCodec } from './boolean'

describe('Boolean Codec', () => {
  const codec = new BooleanCodec()

  executeDecodeTests([
    decodeSuccessExpectation('parse simple boolean', codec, true, true),
    decodeFailureExpectation('not parse strings', codec, 'test', ['', 'must be a boolean']),
    decodeFailureExpectation('not parse numbers', codec, 123, ['', 'must be a boolean'])
  ])
})
