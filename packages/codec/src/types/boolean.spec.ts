import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { BooleanCodec } from './boolean'

describe('Boolean Codec', () => {
  const codec = new BooleanCodec()

  executeDecodeTests([
    decodeSuccessExpectation('parse simple boolean', codec, true, true),
    decodeSuccessExpectation('parse lenient string', codec.lenient(), 'true', true),
    decodeSuccessExpectation('parse lenient string', codec.lenient(), 'false', false),
    decodeSuccessExpectation('parse lenient string', codec.lenient(), 'TRUE', true),
    decodeSuccessExpectation('parse lenient string', codec.lenient(), 'FALSE', false),
    decodeFailureExpectation('not parse lenient string when invalid', codec.lenient(), '1', [
      '',
      'must be a boolean'
    ]),
    decodeFailureExpectation('not parse lenient string when invalid', codec.lenient(), '0', [
      '',
      'must be a boolean'
    ]),
    decodeFailureExpectation('not parse strings', codec, 'test', ['', 'must be a boolean']),
    decodeFailureExpectation('not parse numbers', codec, 123, ['', 'must be a boolean'])
  ])
})
