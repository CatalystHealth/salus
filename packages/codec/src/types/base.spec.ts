import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { NumberCodec } from './number'
import { StringCodec } from './string'

describe('Base Codec', () => {
  const codec = new StringCodec()
  const numberCodec = new NumberCodec()

  executeDecodeTests([
    decodeSuccessExpectation(
      'parse with custom refinements',
      codec.refine((val) => val === 'hello', 'must say hello'),
      'hello',
      'hello'
    ),
    decodeFailureExpectation(
      'parse with custom refinements',
      codec.refine((val) => val === 'hello', 'must say hello'),
      'world',
      ['', 'must say hello']
    )
  ])

  executeDecodeTests([
    decodeSuccessExpectation(
      'parse with preprocessor',
      numberCodec
        .preprocess((value) => (value as number) + 1)
        .preprocess((value) => (value as number) + 1),
      0,
      2
    ),
    decodeSuccessExpectation(
      'parse with preprocessor that transforms',
      codec
        .nullable()
        .preprocess((value) => (typeof value === 'string' ? value.trim() || null : value)),
      '',
      null
    )
  ])
})
