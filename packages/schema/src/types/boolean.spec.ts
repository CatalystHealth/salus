import { decode, encode } from '../functions'

import { BooleanSchema } from './boolean'

describe('Boolean Schema', () => {
  it('must fail to parse a non-boolean', () => {
    const schema = new BooleanSchema()
    const decoded = decode(schema, 'hello')

    expect(decoded).toHaveValidationFailure([''], 'must be a boolean')
  })

  it('must parse a boolean', () => {
    const schema = new BooleanSchema()
    const decoded = decode(schema, true)

    expect(decoded).toHaveValidationSuccess(true)
  })

  it('must encode a boolean', () => {
    const schema = new BooleanSchema()
    const decoded = encode(schema, true)

    expect(decoded).toEqual(true)
  })
})
