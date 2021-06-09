import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { BooleanCodec } from './boolean'

describe('Boolean Codec', () => {
  const codec = new BooleanCodec()

  executeDecodeTests([
    decodeSuccessExpectation('parse simple boolean', codec, true, true),
    decodeSuccessExpectation('parse lenient string true', codec.lenient(), 'true', true),
    decodeSuccessExpectation('parse lenient string false', codec.lenient(), 'false', false),
    decodeSuccessExpectation('parse lenient string TRUE', codec.lenient(), 'TRUE', true),
    decodeSuccessExpectation('parse lenient string FALSE', codec.lenient(), 'FALSE', false),
    decodeFailureExpectation('not parse string when not in lenient mode', codec, 'true', [
      '',
      'must be a boolean'
    ]),
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
