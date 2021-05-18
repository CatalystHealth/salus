import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { NumberCodec } from './number'
import { StringCodec } from './string'
import { UnionCodec } from './union'

describe('Union Codec', () => {
  const codec = new UnionCodec([new StringCodec(), new NumberCodec()])

  executeDecodeTests([
    createSuccessfulExpectation('parse first union member', codec, 'hello', 'hello'),
    createSuccessfulExpectation('parse second union member', codec, 1, 1),
    createFailureExpectation(
      'reject undefined',
      codec,
      undefined,
      ['', 'must be a string'],
      ['', 'must be a number']
    )
  ])
})
