import { decode, encode } from '../functions'

import { ArraySchema } from './array'
import { StringSchema } from './string'

describe('Array Schema', () => {
  it('must fail to parse a non-array', () => {
    const schema = new ArraySchema(new StringSchema())
    const decoded = decode(schema, 'hello')

    expect(decoded).toHaveValidationFailure([''], 'must be an array')
  })

  it('must parse an empty array', () => {
    const schema = new ArraySchema(new StringSchema())
    const decoded = decode(schema, [])

    expect(decoded).toHaveValidationSuccess([])
  })

  it('must reject invalid items', () => {
    const schema = new ArraySchema(new StringSchema())
    const decoded = decode(schema, [123])

    expect(decoded).toHaveValidationFailure(['', '0'], 'must be a string')
  })

  it('must pass through underlying errors', () => {
    const schema = new ArraySchema(new StringSchema())
    const decoded = decode(schema, [123, false])

    expect(decoded).toHaveValidationFailure(['', '0'], 'must be a string')
    expect(decoded).toHaveValidationFailure(['', '1'], 'must be a string')
  })

  it('must handle minimum size', () => {
    const schema = new ArraySchema(new StringSchema()).minLength(2)
    const decoded = decode(schema, ['one'])

    expect(decoded).toHaveValidationFailure([''], 'must be at least 2 items')
  })

  it('must handle maximum size', () => {
    const schema = new ArraySchema(new StringSchema()).maxLength(1)
    const decoded = decode(schema, ['one', 'two'])

    expect(decoded).toHaveValidationFailure([''], 'must not exceed 1 items')
  })

  it('must encode properly', () => {
    const schema = new ArraySchema(new StringSchema()).maxLength(1)
    const encoded = encode(schema, ['one', 'two'])

    expect(encoded).toEqual(['one', 'two'])
  })
})
