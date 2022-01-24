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
    decodeSuccessExpectation('trims string by default', codec, ' hello ', 'hello'),
    decodeSuccessExpectation('does not trim on override', codec.doNotTrim(), ' hello ', ' hello '),
    decodeSuccessExpectation(
      'allows blank string trimmed as empty on override',
      codec.allowEmpty(),
      ' ',
      ''
    ),
    decodeSuccessExpectation('allows empty string on override', codec.allowEmpty(), '', ''),
    decodeSuccessExpectation(
      'allows blank string when trim and empty both overriden',
      codec.doNotTrim().allowEmpty(),
      ' ',
      ' '
    ),
    decodeFailureExpectation('not parse numbers', codec, 1, ['', 'must be a string']),
    decodeFailureExpectation('not parse booleans', codec, false, ['', 'must be a string']),
    decodeFailureExpectation('does not allow empty string by default', codec, '', [
      '',
      'must not be empty'
    ]),
    decodeFailureExpectation('does not allow blank string by default', codec, ' ', [
      '',
      'must not be empty'
    ]),
    decodeFailureExpectation('respect minLength', codec.minLength(2), 'a', [
      '',
      'must be at least 2 characters'
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
