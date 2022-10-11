import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { NumberCodec } from './number'

describe('Number Codec', () => {
  const codec = new NumberCodec()

  executeDecodeTests([
    decodeSuccessExpectation('parse simple number', codec, 1, 1),
    decodeSuccessExpectation('parse simple number with bounds', codec.min(1).max(3), 2, 2),
    decodeSuccessExpectation('parse simple number with bounds', codec.min(1).max(3), 1, 1),
    decodeSuccessExpectation('parse simple number with bounds', codec.min(1).max(3), 3, 3),
    decodeSuccessExpectation('parse lenient string', codec.lenient(), '10', 10),
    decodeFailureExpectation('not parse strings', codec, 'test', ['', 'must be a number']),
    decodeFailureExpectation('not parse booleans', codec, false, ['', 'must be a number']),
    decodeFailureExpectation('not parse lenient string when invalid', codec.lenient(), 'hello', [
      '',
      'must be a number'
    ]),
    decodeFailureExpectation('respect min', codec.min(1), 0, ['', 'must be at least 1']),
    decodeFailureExpectation('respect max', codec.max(1), 2, ['', 'must be at most 1']),
    decodeFailureExpectation('respect integer', codec.integer(), 2.5, ['', 'must be an integer']),
    decodeFailureExpectation('respect integer', codec.integer(), 2.5, ['', 'must be an integer'])
  ])
})
