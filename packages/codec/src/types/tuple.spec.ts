import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { StringCodec } from './string'
import { TupleCodec } from './tuple'

describe('Tuple Codec', () => {
  const codec = new TupleCodec([new StringCodec()])

  executeDecodeTests([
    decodeSuccessExpectation('parse simple tuple', codec, ['hello'], ['hello']),
    decodeFailureExpectation(
      'fail to parse with invalid length',
      codec,
      ['one', 'two'],
      ['', 'must have exactly 1 values']
    ),
    decodeFailureExpectation(
      'fail to parse with invalid child content',
      codec,
      [1],
      ['0', 'must be a string']
    )
  ])
})
