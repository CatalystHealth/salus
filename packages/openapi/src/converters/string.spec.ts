import { t } from '@salus-js/codec'

import { SchemaVisitor } from '../visitor'

import { StringConverter } from './string'

describe('string', () => {
  it('should work without refinements', () => {
    const codec = t.string
    const converted = StringConverter.convert(codec, new SchemaVisitor(), () => ({}))

    expect(converted).toStrictEqual({
      type: 'string'
    })
  })

  it('should overwrite later refinements', () => {
    const codec = t.string.maxLength(1).maxLength(2)
    const converted = StringConverter.convert(codec, new SchemaVisitor(), () => ({}))

    expect(converted).toStrictEqual({
      type: 'string',
      maxLength: 2
    })
  })
})
