import { createSuccessfulExpectation, executeDecodeTests } from '../testUtil'

import { UnknownCodec } from './unknown'

describe('Unknown Codec', () => {
  const codec = new UnknownCodec()

  executeDecodeTests([
    createSuccessfulExpectation('parse anything', codec, 'hello', 'hello'),
    createSuccessfulExpectation('parse anything', codec, 1, 1),
    createSuccessfulExpectation('parse anything', codec, true, true),
    createSuccessfulExpectation('parse anything', codec, { one: 'one' }, { one: 'one' }),
    createSuccessfulExpectation('parse anything', codec, ['hello', 'world'], ['hello', 'world'])
  ])
})
