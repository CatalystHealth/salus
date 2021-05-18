import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { NullCodec } from './null'

describe('Null Codec', () => {
  const codec = new NullCodec()

  executeDecodeTests([
    createSuccessfulExpectation('parse null', codec, null, null),
    createFailureExpectation('reject undefined', codec, undefined, ['', 'must be null']),
    createFailureExpectation('reject numbers', codec, 1, ['', 'must be null']),
    createFailureExpectation('reject booleans', codec, true, ['', 'must be null']),
    createFailureExpectation('reject strings', codec, 'test', ['', 'must be null'])
  ])
})
