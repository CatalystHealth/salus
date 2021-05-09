import {
  ArraySchema,
  BaseSchema,
  BooleanSchema,
  EnumSchema,
  LazySchema,
  LiteralSchema,
  NullSchema,
  NumberSchema,
  ObjectSchema,
  OptionalSchema,
  Props,
  RecordSchema,
  StringSchema,
  UndefinedSchema,
  UnionSchema
} from '@trpc/schema'

import { createSimpleConverter, mapRefinement } from './converter'

export const numberConverter = createSimpleConverter(NumberSchema, (schema) => ({
  type: 'number',
  ...mapRefinement<number>(schema, 'max', (max) => ({
    maximum: max
  })),
  ...mapRefinement<number>(schema, 'min', (min) => ({
    minimum: min
  })),
  ...mapRefinement<number>(schema, 'multipleOf', (multipleOf) => ({
    multipleOf
  }))
}))

export const objectConverter = createSimpleConverter(ObjectSchema, (schema, registry) => {
  const keys = Object.entries(schema.props as Props)

  return {
    type: 'object',
    properties: Object.fromEntries(keys.map(([key, value]) => [key, registry.resolve(value)])),
    required: [...schema.requiredProperties]
  }
})

export const stringConverter = createSimpleConverter(StringSchema, (schema) => ({
  type: 'string',
  ...mapRefinement<number>(schema, 'maxLength', (max) => ({
    maxLength: max
  })),
  ...mapRefinement<number>(schema, 'minLength', (min) => ({
    minLength: min
  })),
  ...mapRefinement<RegExp>(schema, 'pattern', (pattern) => ({
    pattern: pattern.source
  })),
  ...mapRefinement<string[]>(schema, 'enum', (options) => ({
    enum: options
  }))
}))

export const unionConverter = createSimpleConverter(UnionSchema, (schema, registry) => {
  const withoutUndefined = schema.schemas.filter((child) => !(child instanceof UndefinedSchema))

  return {
    oneOf: withoutUndefined.map((child) => registry.resolve(child))
  }
})

export const nullConverter = createSimpleConverter(NullSchema, () => ({
  type: 'null'
}))

export const arrayConverter = createSimpleConverter(ArraySchema, (schema, registry) => ({
  type: 'array',
  items: registry.resolve(schema.itemSchema),
  ...mapRefinement<number>(schema, 'maxLength', (max) => ({
    maxItems: max
  })),
  ...mapRefinement<number>(schema, 'minLength', (min) => ({
    minItems: min
  }))
}))

export const optionalConverter = createSimpleConverter(OptionalSchema, (schema, registry) => ({
  ...registry.resolve(schema.schema)
}))

export const booleanConverter = createSimpleConverter(BooleanSchema, () => ({
  type: 'boolean'
}))

export const recordConverter = createSimpleConverter(RecordSchema, (schema, registry) => ({
  type: 'object',
  additionalProperties: registry.resolve(schema.valueSchema)
}))

export const enumConverter = createSimpleConverter(EnumSchema, (schema) => ({
  type: 'string',
  enum: Object.values(schema.enumObject)
}))

export const literalConverter = createSimpleConverter(LiteralSchema, (schema) => ({
  type: 'string',
  enum: [schema.value],
  default: schema.value as string
}))

export const lazyConverter = createSimpleConverter(LazySchema, (schema, registry) => {
  if (!schema.options.name) {
    throw new Error('Lazy schemas must be named to avoid infinite recursion')
  }

  return registry.resolve(schema.schema)
})

export const defaultConverters = [
  stringConverter,
  objectConverter,
  unionConverter,
  numberConverter,
  nullConverter,
  arrayConverter,
  optionalConverter,
  booleanConverter,
  recordConverter,
  enumConverter,
  literalConverter,
  lazyConverter
]
