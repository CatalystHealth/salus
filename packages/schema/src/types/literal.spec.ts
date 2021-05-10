import { LiteralSchema } from '..'
import { decode, encode } from '../functions'

describe('Literal Schema', () => {
  it('must fail to parse a non-string', () => {
    const schema = new LiteralSchema('hello')
    const decoded = decode(schema, 123)

    expect(decoded).toHaveValidationFailure([''], 'must be hello')
  })

  it('must parse an exact value', () => {
    const schema = new LiteralSchema('hello')
    const decoded = decode(schema, 'hello')

    expect(decoded).toHaveValidationSuccess('hello')
  })

  it('must encode an exact value', () => {
    const schema = new LiteralSchema('hello')
    const decoded = encode(schema, 'hello')

    expect(decoded).toEqual('hello')
  })
})
