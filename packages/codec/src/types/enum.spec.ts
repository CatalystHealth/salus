import { decodeFailureExpectation, decodeSuccessExpectation, executeDecodeTests } from '../testUtil'

import { EnumCodec } from './enum'

enum TestEnum {
  ONE = 'one',
  TWO = 'two'
}

describe('Enum Codec', () => {
  const codec = new EnumCodec(TestEnum)
  const stringEnumCodec = new EnumCodec(['one', 'two'])

  executeDecodeTests([
    decodeSuccessExpectation('parse simple enum', codec, 'one', TestEnum.ONE),
    decodeFailureExpectation('reject invalid values', codec, 'three', [
      '',
      'must be one of: one, two'
    ]),
    decodeFailureExpectation('reject invalid types', codec, 11, ['', 'must be one of: one, two'])
  ])

  executeDecodeTests([
    decodeSuccessExpectation('parse simple enum', stringEnumCodec, 'one', 'one'),
    decodeFailureExpectation('reject invalid values', stringEnumCodec, 'three', [
      '',
      'must be one of: one, two'
    ]),
    decodeFailureExpectation('reject invalid types', codec, 11, ['', 'must be one of: one, two'])
  ])
})
