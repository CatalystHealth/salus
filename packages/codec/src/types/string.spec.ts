import {
  decodeFailureExpectation,
  decodeSuccessExpectation,
  encodeExpectation,
  executeDecodeTests,
  executeEncodeTests
} from '../testUtil'

import { StringCodec } from './string'

describe('String Codec', () => {
  const codec = new StringCodec()

  executeEncodeTests([encodeExpectation('encode simple string', codec, 'hello', 'hello')])

  executeDecodeTests([
    decodeSuccessExpectation('parse simple string', codec, 'hello', 'hello'),
    decodeSuccessExpectation(
      'parse simple string with length',
      codec.minLength(1).maxLength(3),
      'te',
      'te'
    ),
    decodeSuccessExpectation(
      'parse simple string with pattern',
      codec.pattern(/^hello$/),
      'hello',
      'hello'
    ),
    decodeFailureExpectation('not parse numbers', codec, 1, ['', 'must be a string']),
    decodeFailureExpectation('not parse booleans', codec, false, ['', 'must be a string']),
    decodeFailureExpectation('respect minLength', codec.minLength(1), '', [
      '',
      'must be at least 1 characters'
    ]),
    decodeFailureExpectation('respect maxLength', codec.maxLength(1), 'asdf', [
      '',
      'must be no more than 1 characters'
    ]),
    decodeFailureExpectation('respect pattern', codec.pattern(/^hello$/), 'hello world', [
      '',
      'must match ^hello$'
    ])
  ])
})
