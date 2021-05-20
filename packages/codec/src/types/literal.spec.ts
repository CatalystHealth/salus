import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { LiteralCodec } from './literal'

describe('Literal Codec', () => {
  const codec = new LiteralCodec('hello')
  const numberCodec = new LiteralCodec(123)
  const booleanCodec = new LiteralCodec(true)

  executeDecodeTests([
    decodeSuccessExpectation('parse string exactly', codec, 'hello', 'hello'),
    decodeSuccessExpectation('parse number exactly', numberCodec, 123, 123),
    decodeSuccessExpectation('parse boolean exactly', booleanCodec, true, true),
    decodeFailureExpectation('reject undefined', codec, undefined, ['', 'must be exactly "hello"']),
    decodeFailureExpectation('reject numbers', codec, 1, ['', 'must be exactly "hello"']),
    decodeFailureExpectation('reject booleans', codec, true, ['', 'must be exactly "hello"']),
    decodeFailureExpectation('reject strings', codec, 'test', ['', 'must be exactly "hello"']),
    decodeFailureExpectation('reject undefined for number', numberCodec, undefined, [
      '',
      'must be exactly "123"'
    ]),
    decodeFailureExpectation('reject undefined for boolean', booleanCodec, undefined, [
      '',
      'must be exactly "true"'
    ])
  ])
})
