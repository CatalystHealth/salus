import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { StringCodec } from './string'

describe('Base Codec', () => {
  const codec = new StringCodec()

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
})
