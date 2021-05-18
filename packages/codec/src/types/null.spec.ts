import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { NullCodec } from './null'

describe('Null Codec', () => {
  const codec = new NullCodec()

  executeDecodeTests([
    decodeSuccessExpectation('parse null', codec, null, null),
    decodeFailureExpectation('reject undefined', codec, undefined, ['', 'must be null']),
    decodeFailureExpectation('reject numbers', codec, 1, ['', 'must be null']),
    decodeFailureExpectation('reject booleans', codec, true, ['', 'must be null']),
    decodeFailureExpectation('reject strings', codec, 'test', ['', 'must be null'])
  ])
})
