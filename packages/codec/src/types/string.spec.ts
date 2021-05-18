import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { StringCodec } from './string'

describe('String Codec', () => {
  const codec = new StringCodec()

  executeDecodeTests([
    createSuccessfulExpectation('parse simple string', codec, 'hello', 'hello'),
    createSuccessfulExpectation(
      'parse simple string with length',
      codec.minLength(1).maxLength(3),
      'te',
      'te'
    ),
    createSuccessfulExpectation(
      'parse simple string with pattern',
      codec.pattern(/^hello$/),
      'hello',
      'hello'
    ),
    createFailureExpectation('not parse numbers', codec, 1, ['', 'must be a string']),
    createFailureExpectation('not parse booleans', codec, false, ['', 'must be a string']),
    createFailureExpectation('respect minLength', codec.minLength(1), '', [
      '',
      'must be at least 1 characters'
    ]),
    createFailureExpectation('respect maxLength', codec.maxLength(1), 'asdf', [
      '',
      'must be no more than 1 characters'
    ]),
    createFailureExpectation('respect pattern', codec.pattern(/^hello$/), 'hello world', [
      '',
      'must match ^hello$'
    ])
  ])
})
