import { decode, encode } from '../functions'

import { UndefinedSchema } from './undefined'

describe('Undefined Schema', () => {
  it('must fail to parse a non-undefined', () => {
    const schema = new UndefinedSchema()
    const decoded = decode(schema, 'hello')

    expect(decoded).toHaveValidationFailure([''], 'must be undefined')
  })

  it('must parse a null', () => {
    const schema = new UndefinedSchema()
    const decoded = decode(schema, undefined)

    expect(decoded).toHaveValidationSuccess(undefined)
  })

  it('must encode a boolean', () => {
    const schema = new UndefinedSchema()
    const decoded = encode(schema, undefined)

    expect(decoded).toEqual(undefined)
  })
})
