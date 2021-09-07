import { t } from '@salus-js/codec'

import { NullableConverter } from './converters/nullable'
import { ReferenceConverter } from './converters/reference'
import { StringConverter } from './converters/string'
import { SchemaVisitor } from './visitor'

describe('SchemaVisitor', () => {
  it('should mark wrapped codecs', () => {
    const visitor = new SchemaVisitor({
      converters: [StringConverter, ReferenceConverter]
    })

    const namedSchema = t.named('test', t.string)

    const result = visitor.convert(
      namedSchema.document({
        description: 'This is a description'
      })
    )

    expect(result).toHaveProperty('x-wrapped', true)
  })

  it('should support null examples', () => {
    const visitor = new SchemaVisitor({
      converters: [StringConverter, NullableConverter]
    })

    const result = visitor.convert(
      t.string.nullable().document({
        example: null
      })
    )

    expect(result).toHaveProperty('example', null)
  })
})
