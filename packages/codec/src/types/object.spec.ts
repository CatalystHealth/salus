import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { BooleanCodec } from './boolean'
import { NumberCodec } from './number'
import { ObjectCodec } from './object'
import { OptionalCodec } from './optional'
import { StringCodec } from './string'

describe('Object Codec', () => {
  const codec = new ObjectCodec({
    one: new StringCodec(),
    two: new NumberCodec(),
    three: new OptionalCodec(new BooleanCodec())
  })

  executeDecodeTests([
    createSuccessfulExpectation(
      'parse valid object',
      codec,
      {
        one: 'one',
        two: 2
      },
      {
        one: 'one',
        two: 2
      }
    ),
    createSuccessfulExpectation(
      'parse valid object with optional',
      codec,
      {
        one: 'one',
        two: 2,
        three: true
      },
      {
        one: 'one',
        two: 2,
        three: true
      }
    ),
    createSuccessfulExpectation(
      'strip extra properties',
      codec,
      {
        one: 'one',
        two: 2,
        four: 'asdf'
      },
      {
        one: 'one',
        two: 2
      }
    ),
    createFailureExpectation(
      'not parse invalid keys',
      codec,
      { one: 12, two: 'string' },
      ['one', 'must be a string'],
      ['two', 'must be a number']
    ),
    createFailureExpectation('not parse when missing invalid keys', codec, {}, [
      '',
      'missing required keys: one, two'
    ])
  ])
})
