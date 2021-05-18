import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { NumberCodec } from './number'

describe('Number Codec', () => {
  const codec = new NumberCodec()

  executeDecodeTests([
    createSuccessfulExpectation('parse simple number', codec, 1, 1),
    createSuccessfulExpectation('parse simple number with bounds', codec.min(1).max(3), 2, 2),
    createSuccessfulExpectation('parse lenient string', codec.lenient(), '10', 10),
    createFailureExpectation('not parse strings', codec, 'test', ['', 'must be a number']),
    createFailureExpectation('not parse booleans', codec, false, ['', 'must be a number']),
    createFailureExpectation('not parse lenient string when invalid', codec.lenient(), 'hello', [
      '',
      'must be a number'
    ]),
    createFailureExpectation('respect min', codec.min(1), 0, ['', 'must be greater than 1']),
    createFailureExpectation('respect max', codec.max(1), 2, ['', 'must be less than 1']),
    createFailureExpectation('respect integer', codec.integer(), 2.5, ['', 'must be an integer']),
    createFailureExpectation('respect integer', codec.integer(), 2.5, ['', 'must be an integer'])
  ])
})
