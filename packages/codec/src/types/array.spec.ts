import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { ArrayCodec } from './array'
import { StringCodec } from './string'

describe('Array Codec', () => {
  const codec = new ArrayCodec(new StringCodec())

  executeDecodeTests([
    decodeSuccessExpectation('parse simple array', codec, ['hello'], ['hello']),
    decodeSuccessExpectation('parse simple array when lenient', codec.lenient(), 'hello', [
      'hello'
    ]),
    decodeFailureExpectation('parse using inner codec', codec, [true], ['0', 'must be a string']),
    decodeFailureExpectation('not parse strings', codec, 'test', ['', 'must be an array']),
    decodeFailureExpectation('not parse numbers', codec, 123, ['', 'must be an array'])
  ])
})
