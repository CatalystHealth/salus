import { decode, encode } from '../functions'

import { NumberSchema } from './number'
import { ObjectSchema } from './object'
import { StringSchema } from './string'

describe('Object Schema', () => {
  it('must fail to parse a non-object', () => {
    const schema = new ObjectSchema({})

    expect(decode(schema, 123)).toHaveValidationFailure([''], 'must be an object')
  })

  it('must parse all children', () => {
    const schema = new ObjectSchema({
      firstKey: new StringSchema(),
      secondKey: new NumberSchema()
    })

    const decoded = decode(schema, { firstKey: 123, secondKey: '' })

    expect(decoded).toHaveValidationFailure(['', 'firstKey'], 'must be a string')
    expect(decoded).toHaveValidationFailure(['', 'secondKey'], 'must be a number')
  })

  it('must handle valid objects', () => {
    const schema = new ObjectSchema({
      firstKey: new StringSchema(),
      secondKey: new NumberSchema()
    })

    const decoded = decode(schema, { firstKey: '', secondKey: 123 })

    expect(decoded).toHaveValidationSuccess({
      firstKey: '',
      secondKey: 123
    })
  })

  it('must extend keys', () => {
    const schema = new ObjectSchema({
      firstKey: new StringSchema()
    }).extend({
      secondKey: new NumberSchema()
    })

    const decoded = decode(schema, { firstKey: '' })

    expect(decoded).toHaveValidationFailure([''], 'missing required keys: secondKey')
  })

  it('must omit keys', () => {
    const schema = new ObjectSchema({
      firstKey: new StringSchema(),
      secondKey: new NumberSchema()
    }).omit(['secondKey'])

    const decoded = decode(schema, { firstKey: '' })

    expect(decoded).toHaveValidationSuccess({
      firstKey: ''
    })
  })

  it('must encode objects', () => {
    const schema = new ObjectSchema({
      firstKey: new StringSchema(),
      secondKey: new NumberSchema()
    })

    const encoded = encode(schema, { firstKey: '', secondKey: 123 })

    expect(encoded).toEqual({
      firstKey: '',
      secondKey: 123
    })
  })
})
