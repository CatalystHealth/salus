import { SchemaObject } from 'openapi3-ts'

import { BaseSchema } from '../../schema/src/types/base'

import { SchemaConverterContext } from './registry'

import { SchemaConverter } from './index'

type Type<T> = new (...args: any[]) => T

export function createSimpleConverter<S extends BaseSchema<any>>(
  type: Type<S>,
  converter: (schema: S, registry: SchemaConverterContext) => SchemaObject
): SchemaConverter {
  return {
    convert: (schema, registry, next) => {
      if (schema instanceof type) {
        const documentation = converter(schema, registry)

        if (schema.options.description) {
          documentation.description = schema.options.description
        }

        if (schema.options.example) {
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          documentation.example = schema.options.example
        }

        return documentation
      }

      return next()
    }
  }
}

export function mapRefinement<P>(
  schema: BaseSchema<any>,
  name: string,
  mapping: (args: P) => SchemaObject
): SchemaObject {
  const refinement = (schema.options.refinements || []).find(
    (refinement) => refinement.type === name
  )

  if (!refinement) {
    return {}
  }

  return mapping(refinement.arguments)
}
