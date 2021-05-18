import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { UndefinedCodec } from './undefined'

describe('Undefined Codec', () => {
  const codec = new UndefinedCodec()

  executeDecodeTests([
    decodeSuccessExpectation('parse undefined', codec, undefined, undefined),
    decodeFailureExpectation('reject null', codec, null, ['', 'must be undefined']),
    decodeFailureExpectation('reject numbers', codec, 1, ['', 'must be undefined']),
    decodeFailureExpectation('reject booleans', codec, true, ['', 'must be undefined']),
    decodeFailureExpectation('reject strings', codec, 'test', ['', 'must be undefined'])
  ])
})
