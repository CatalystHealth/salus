import {
  decodeFailureExpectation,
  decodeSuccessExpectation,
  encodeExpectation,
  executeDecodeTests,
  executeEncodeTests
} from '../testUtil'

import { IsoDateTimeCodec } from './isoDateTime'

describe('ISO DateTime Codec', () => {
  const codec = new IsoDateTimeCodec()
  const date = new Date('1990-10-10T13:37:59.123Z')

  executeEncodeTests([
    encodeExpectation('encode simple datetime', codec, date, '1990-10-10T13:37:59.123Z')
  ])

  executeDecodeTests([
    decodeSuccessExpectation(
      'parse valid datetime',
      codec,
      '1990-10-10T01:23:00.000Z',
      new Date('1990-10-10T01:23:00.000Z')
    ),
    decodeSuccessExpectation(
      'parse valid datetime without milliseconds',
      codec,
      '1990-10-10T01:23:00Z',
      new Date('1990-10-10T01:23:00.000Z')
    ),
    decodeSuccessExpectation(
      'parse valid datetime without milliseconds with offset',
      codec,
      '1990-10-10T01:23:00+04:00',
      new Date('1990-10-10T01:23:00.000+04:00')
    ),
    decodeSuccessExpectation(
      'parse valid datetime with milliseconds with offset',
      codec,
      '1990-10-10T01:23:00.000+04:00',
      new Date('1990-10-10T01:23:00.000+04:00')
    ),
    decodeFailureExpectation('not parse date only', codec, '1990-10-10', [
      '',
      'must be a valid ISO datetime'
    ]),
    decodeFailureExpectation('not parse invalid date', codec, 'hello', [
      '',
      'must be a valid ISO datetime'
    ]),
    decodeFailureExpectation('not parse date that does not match the regex', codec, '0', [
      '',
      'must be a valid ISO datetime'
    ])
  ])
})
