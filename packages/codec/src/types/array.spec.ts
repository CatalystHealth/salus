import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { ArrayCodec } from './array'
import { StringCodec } from './string'

describe('Array Codec', () => {
  const codec = new ArrayCodec(new StringCodec())

  executeDecodeTests([
    createSuccessfulExpectation('parse simple array', codec, ['hello'], ['hello']),
    createSuccessfulExpectation('parse simple array when lenient', codec.lenient(), 'hello', [
      'hello'
    ]),
    createFailureExpectation('parse using inner codec', codec, [true], ['0', 'must be a string']),
    createFailureExpectation('not parse strings', codec, 'test', ['', 'must be an array']),
    createFailureExpectation('not parse numbers', codec, 123, ['', 'must be an array'])
  ])
})
