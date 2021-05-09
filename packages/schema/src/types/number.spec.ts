import { decode, encode } from '../functions'

import { NumberSchema } from './number'

describe('Number Schema', () => {
  it('must fail to parse a non-number', () => {
    const schema = new NumberSchema()

    expect(decode(schema, 'hello')).toHaveValidationFailure([''], 'must be a number')
  })

  it('must handle minimums', () => {
    const schema = new NumberSchema().min(124)

    expect(decode(schema, 123)).toHaveValidationFailure([''], 'must not be less than 124')
  })

  it('must handle maximums', () => {
    const schema = new NumberSchema().max(122)

    expect(decode(schema, 123)).toHaveValidationFailure([''], 'must not be greater than 122')
  })

  it('must handle multiples', () => {
    const schema = new NumberSchema().multipleOf(2)

    expect(decode(schema, 123)).toHaveValidationFailure([''], 'must be a multiple of 2')
    expect(decode(schema, 124)).toHaveValidationSuccess(124)
  })

  it('must parse a valid number', () => {
    const schema = new NumberSchema()

    expect(decode(schema, 123)).toHaveValidationSuccess(123)
  })

  it('must encode valid value', () => {
    const schema = new NumberSchema()
    const decoded = encode(schema, 123)

    expect(decoded).toEqual(123)
  })
})
