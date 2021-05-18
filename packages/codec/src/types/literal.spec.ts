import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { LiteralCodec } from './literal'

describe('Literal Codec', () => {
  const codec = new LiteralCodec('hello')

  executeDecodeTests([
    decodeSuccessExpectation('parse exactly', codec, 'hello', 'hello'),
    decodeFailureExpectation('reject undefined', codec, undefined, ['', 'must be exactly "hello"']),
    decodeFailureExpectation('reject numbers', codec, 1, ['', 'must be exactly "hello"']),
    decodeFailureExpectation('reject booleans', codec, true, ['', 'must be exactly "hello"']),
    decodeFailureExpectation('reject strings', codec, 'test', ['', 'must be exactly "hello"'])
  ])
})
