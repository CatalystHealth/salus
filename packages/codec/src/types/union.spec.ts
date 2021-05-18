import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { NumberCodec } from './number'
import { StringCodec } from './string'
import { UnionCodec } from './union'

describe('Union Codec', () => {
  const codec = new UnionCodec([new StringCodec(), new NumberCodec()])

  executeDecodeTests([
    decodeSuccessExpectation('parse first union member', codec, 'hello', 'hello'),
    decodeSuccessExpectation('parse second union member', codec, 1, 1),
    decodeFailureExpectation(
      'reject undefined',
      codec,
      undefined,
      ['', 'must be a string'],
      ['', 'must be a number']
    )
  ])
})
