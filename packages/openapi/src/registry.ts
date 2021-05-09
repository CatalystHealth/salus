import { MixedSchema, BaseSchema } from '@tsio/schema'
import { ReferenceObject, SchemaObject } from 'openapi3-ts'

import { SchemaConverter } from '.'

export class SchemaConverterContext {
  private readonly convertedSchemas = new Map<MixedSchema, SchemaObject | ReferenceObject>()
  private readonly wellKnownSchemas = new Map<string, SchemaObject>()

  constructor(private readonly converters: SchemaConverter[]) {}

  /**
   * Converts the schema into an OpenAPI-compatible schema
   *
   * @param schema the schema to convert
   * @return the converted OpenAPI compatible schema
   */
  public resolve(schema: MixedSchema): SchemaObject | ReferenceObject {
    let index = 0
    const next = () => {
      const currentIndex = index++
      const converter = currentIndex > this.converters.length ? null : this.converters[currentIndex]
      if (!converter) {
        throw new Error(`No OpenAPI converters available for ${schema.constructor.name}`)
      }

      return converter.convert(schema, this, next)
    }

    // Named schemas need special handling
    if (schema instanceof BaseSchema && schema.options.name) {
      const name = schema.options.name
      if (!this.wellKnownSchemas.has(name)) {
        this.wellKnownSchemas.set(name, {})
        const result = next()
        this.wellKnownSchemas.set(name, result)
      }

      return {
        $ref: `#/components/schemas/${name}`
      }
    }

    return next()
  }

  /**
   * Returns all known/visited schemas
   */
  public knownSchemas(): Record<string, SchemaObject> {
    return [...this.wellKnownSchemas].reduce(
      (registry, [name, schema]) => ({
        ...registry,
        [name]: schema
      }),
      {} as Record<string, SchemaObject>
    )
  }
}
