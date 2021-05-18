import { decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { UnknownCodec } from './unknown'

describe('Unknown Codec', () => {
  const codec = new UnknownCodec()

  executeDecodeTests([
    decodeSuccessExpectation('parse anything', codec, 'hello', 'hello'),
    decodeSuccessExpectation('parse anything', codec, 1, 1),
    decodeSuccessExpectation('parse anything', codec, true, true),
    decodeSuccessExpectation('parse anything', codec, { one: 'one' }, { one: 'one' }),
    decodeSuccessExpectation('parse anything', codec, ['hello', 'world'], ['hello', 'world'])
  ])
})
