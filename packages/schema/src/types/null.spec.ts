import { decode, encode } from '../functions'

import { NullSchema } from './null'

describe('Null Schema', () => {
  it('must fail to parse a non-null', () => {
    const schema = new NullSchema()
    const decoded = decode(schema, 'hello')

    expect(decoded).toHaveValidationFailure([''], 'must be null')
  })

  it('must parse a null', () => {
    const schema = new NullSchema()
    const decoded = decode(schema, null)

    expect(decoded).toHaveValidationSuccess(null)
  })

  it('must encode a boolean', () => {
    const schema = new NullSchema()
    const decoded = encode(schema, null)

    expect(decoded).toEqual(null)
  })
})
