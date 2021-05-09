import { decode, encode } from '../functions'

import { RecordSchema } from './record'
import { StringSchema } from './string'

describe('Record Schema', () => {
  it('must fail to parse a non-record', () => {
    const schema = new RecordSchema(new StringSchema())
    const decoded = decode(schema, 'hello')

    expect(decoded).toHaveValidationFailure([''], 'must be an object')
  })

  it('must fail to parse an invalid value', () => {
    const schema = new RecordSchema(new StringSchema())
    const decoded = decode(schema, {
      some: 123,
      other: false
    })

    expect(decoded).toHaveValidationFailure(['', 'some'], 'must be a string')
    expect(decoded).toHaveValidationFailure(['', 'other'], 'must be a string')
  })

  it('must parse valid value', () => {
    const schema = new RecordSchema(new StringSchema())
    const decoded = decode(schema, {
      some: '123',
      other: 'false'
    })

    expect(decoded).toHaveValidationSuccess({
      some: '123',
      other: 'false'
    })
  })

  it('must encode valid value', () => {
    const schema = new RecordSchema(new StringSchema())
    const decoded = encode(schema, {
      some: '123',
      other: 'false'
    })

    expect(decoded).toEqual({
      some: '123',
      other: 'false'
    })
  })
})
