import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { EnumCodec } from './enum'

enum TestEnum {
  ONE = 'one',
  TWO = 'two'
}

describe('Enum Codec', () => {
  const codec = new EnumCodec(TestEnum)
  const stringEnumCodec = new EnumCodec(['one', 'two'])

  executeDecodeTests([
    createSuccessfulExpectation('parse simple enum', codec, 'one', TestEnum.ONE),
    createFailureExpectation('reject invalid values', codec, 'three', [
      '',
      'must be one of: one, two'
    ]),
    createFailureExpectation('reject invalid types', codec, 11, ['', 'must be one of: one, two'])
  ])

  executeDecodeTests([
    createSuccessfulExpectation('parse simple enum', stringEnumCodec, 'one', 'one'),
    createFailureExpectation('reject invalid values', stringEnumCodec, 'three', [
      '',
      'must be one of: one, two'
    ]),
    createFailureExpectation('reject invalid types', codec, 11, ['', 'must be one of: one, two'])
  ])
})
