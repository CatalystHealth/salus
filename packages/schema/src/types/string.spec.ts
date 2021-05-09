import { decode, encode } from '../functions'

import { StringSchema } from './string'

describe('String Schema', () => {
  it('must fail to parse a non-string', () => {
    const schema = new StringSchema()

    expect(decode(schema, 123)).toHaveValidationFailure([''], 'must be a string')
  })

  it('must handle minimum length', () => {
    const schema = new StringSchema().minLength(1)

    expect(decode(schema, '')).toHaveValidationFailure([''], 'must be at least 1 characters')
    expect(decode(schema, '1')).toHaveValidationSuccess('1')
  })

  it('must handle maximum length', () => {
    const schema = new StringSchema().maxLength(2)

    expect(decode(schema, '123')).toHaveValidationFailure([''], 'must not exceed 2 characters')
    expect(decode(schema, '1')).toHaveValidationSuccess('1')
  })

  it('must handle patterns', () => {
    const schema = new StringSchema().pattern(/^Hello /)

    expect(decode(schema, '123')).toHaveValidationFailure([''], 'must match pattern ^Hello ')
    expect(decode(schema, 'Hello World')).toHaveValidationSuccess('Hello World')
  })

  it('must encode strings', () => {
    const schema = new StringSchema()

    expect(encode(schema, '123')).toEqual('123')
  })
})
