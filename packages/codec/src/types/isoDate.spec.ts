import {
  decodeFailureExpectation,
  decodeSuccessExpectation,
  encodeExpectation,
  executeDecodeTests,
  executeEncodeTests
} from '../testUtil'

import { IsoDateCodec } from './isoDate'

describe('ISO Date Codec', () => {
  const codec = new IsoDateCodec()
  const date = new Date('1990-10-10T00:00:00Z')

  executeEncodeTests([encodeExpectation('encode simple date', codec, date, '1990-10-10')])

  executeDecodeTests([
    decodeSuccessExpectation(
      'parse simple date',
      codec,
      '1990-10-10',
      new Date('1990-10-10T00:00:00.000Z')
    ),
    decodeFailureExpectation('not parse invalid date', codec, 'hello', [
      '',
      'must be a valid date'
    ]),
    decodeFailureExpectation('not parse date with time', codec, '1990-10-10T12:10:10.000Z', [
      '',
      'must be a valid date'
    ]),
    decodeFailureExpectation('not parse date that does not match the regex', codec, '0', [
      '',
      'must be a valid date'
    ])
  ])
})
