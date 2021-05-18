import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { BooleanCodec } from './boolean'

describe('Boolean Codec', () => {
  const codec = new BooleanCodec()

  executeDecodeTests([
    createSuccessfulExpectation('parse simple boolean', codec, true, true),
    createFailureExpectation('not parse strings', codec, 'test', ['', 'must be a boolean']),
    createFailureExpectation('not parse numbers', codec, 123, ['', 'must be a boolean'])
  ])
})
