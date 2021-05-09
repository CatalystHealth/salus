import { decode, encode } from '../functions'

import { NumberSchema } from './number'
import { StringSchema } from './string'
import { UnionSchema } from './union'

describe('Union Schema', () => {
  it('must fail to parse a non-union member', () => {
    const schema = new UnionSchema([new StringSchema(), new NumberSchema()])
    const decoded = decode(schema, false)

    expect(decoded).toHaveValidationFailure(
      [''],
      'must meet one of the following criteria: must be a string, must be a number'
    )
  })

  it('must parsee a valid union member', () => {
    const schema = new UnionSchema([new StringSchema(), new NumberSchema()])
    const decoded = decode(schema, 'hello')

    expect(decoded).toHaveValidationSuccess('hello')
  })

  it('must encode a valid union value', () => {
    const schema = new UnionSchema([new StringSchema(), new NumberSchema()])

    expect(encode(schema, '123')).toEqual('123')
  })

  it('must not encode a valid union value', () => {
    const schema = new UnionSchema([new StringSchema(), new NumberSchema()])

    expect(() => encode(schema, false as any)).toThrowError('Value does not conform to any schema')
  })
})
