import { decode, encode } from '../functions'

import { EnumSchema } from './enum'

enum TestEnum {
  ONE = 'one',
  TWO = 'two'
}

describe('Enum Schema', () => {
  it('must fail to parse a non-string', () => {
    const schema = new EnumSchema(TestEnum)
    const decoded = decode(schema, 123)

    expect(decoded).toHaveValidationFailure([''], 'must be a string')
  })

  it('must fail to parse an invalid value', () => {
    const schema = new EnumSchema(TestEnum)
    const decoded = decode(schema, 'three')

    expect(decoded).toHaveValidationFailure([''], 'must be one of: one, two')
  })

  it('must parse a valid value', () => {
    const schema = new EnumSchema(TestEnum)
    const decoded = decode(schema, 'one')

    expect(decoded).toHaveValidationSuccess(TestEnum.ONE)
  })

  it('must encode a valid value', () => {
    const schema = new EnumSchema(TestEnum)
    const decoded = encode(schema, TestEnum.ONE)

    expect(decoded).toEqual('one')
  })
})
