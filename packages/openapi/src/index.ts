import { Schema } from '@tsio/schema'
import { OpenAPIObject, SchemaObject } from 'openapi3-ts'

import { SchemaConverterContext } from './registry'

export type ConverterChain = () => SchemaObject
export type ConverterHandler = (
  schema: Schema<unknown>,
  registry: SchemaConverterContext,
  next: ConverterChain
) => SchemaObject

export interface SchemaConverter {
  convert: ConverterHandler
}

export class OpenAPIGenerator {
  private readonly schemas: Schema<unknown>[] = []
  private readonly converterContext: SchemaConverterContext

  constructor(converters: SchemaConverter[] = []) {
    this.converterContext = new SchemaConverterContext(converters)
  }

  public schema(schema: Schema<unknown>): this {
    this.schemas.push(schema)
    return this
  }

  public generate(): OpenAPIObject {
    for (const schema of this.schemas) {
      const result = this.converterContext.resolve(schema)
    }

    return {
      openapi: '3.1.0',
      info: {
        title: 'Test',
        version: '1.0.0'
      },
      paths: {},
      components: {
        schemas: this.converterContext.knownSchemas()
      }
    }
  }
}
