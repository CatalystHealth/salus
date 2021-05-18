import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { LiteralCodec } from './literal'

describe('Literal Codec', () => {
  const codec = new LiteralCodec('hello')

  executeDecodeTests([
    createSuccessfulExpectation('parse exactly', codec, 'hello', 'hello'),
    createFailureExpectation('reject undefined', codec, undefined, ['', 'must be exactly "hello"']),
    createFailureExpectation('reject numbers', codec, 1, ['', 'must be exactly "hello"']),
    createFailureExpectation('reject booleans', codec, true, ['', 'must be exactly "hello"']),
    createFailureExpectation('reject strings', codec, 'test', ['', 'must be exactly "hello"'])
  ])
})
