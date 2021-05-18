import {
  createFailureExpectation,
  createSuccessfulExpectation,
  executeDecodeTests
} from '../testUtil'

import { UndefinedCodec } from './undefined'

describe('Undefined Codec', () => {
  const codec = new UndefinedCodec()

  executeDecodeTests([
    createSuccessfulExpectation('parse undefined', codec, undefined, undefined),
    createFailureExpectation('reject null', codec, null, ['', 'must be undefined']),
    createFailureExpectation('reject numbers', codec, 1, ['', 'must be undefined']),
    createFailureExpectation('reject booleans', codec, true, ['', 'must be undefined']),
    createFailureExpectation('reject strings', codec, 'test', ['', 'must be undefined'])
  ])
})
