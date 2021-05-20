import { BaseCodec, Codec, ConcreteCodec } from '@salus-js/codec'

import { SchemaConverter } from './converter'
import { defaultConverters } from './converters'
import { isReferenceObject, ReferenceObject, SchemaObject } from './openapi'

interface SchemaVisitorOptions {
  readonly converters: SchemaConverter[]
  readonly namedSchemaVisitor?: (
    name: string,
    generate: () => SchemaObject | ReferenceObject
  ) => void
  readonly referenceRoot?: string
}

const defaultOptions: SchemaVisitorOptions = {
  converters: defaultConverters
}

export class SchemaVisitor {
  private readonly options: SchemaVisitorOptions

  constructor(options: Partial<SchemaVisitorOptions> = {}) {
    this.options = {
      ...defaultOptions,
      ...options
    }
  }

  /**
   * Converts a codec into the compatible OpenAPI schema by passing it through converters.
   *
   * The schema visistor will start by converting the passed codec into a schema. If the codec
   * references other codecs, those may also need to be converted in the process. Each time the
   * visitor comes across a well-known named codec, your registered callback will be invoked
   *
   * @param codec the codec that needs to be converted
   * @returns the converted OpenAPI schema
   */
  public convert(codec: Codec<any>): SchemaObject | ReferenceObject {
    if (codec instanceof ConcreteCodec) {
      if (this.options.namedSchemaVisitor) {
        this.options.namedSchemaVisitor(codec.name, () => this.doConvert(codec.referenced))
      }

      return { $ref: `#${this.options.referenceRoot || ''}/${codec.name}` }
    }

    return this.doConvert(codec)
  }

  private doConvert(codec: Codec<any>): SchemaObject | ReferenceObject {
    let index = 0
    const next = () => {
      if (index > this.options.converters.length - 1) {
        throw new Error(`No converter was able to convert the codec ${codec.constructor.name}`)
      }

      return this.options.converters[index++].convert(codec, this, next)
    }

    const result = next()
    let schema: SchemaObject | ReferenceObject = result

    if (codec instanceof BaseCodec) {
      const additionalProperties: SchemaObject = {}
      if (codec.options.description) {
        additionalProperties.description = codec.options.description
      }

      if (codec.options.example) {
        additionalProperties.example = codec.options.example
      }

      if (Object.keys(additionalProperties).length > 0) {
        schema = isReferenceObject(schema) ? { oneOf: [schema] } : schema
        return {
          ...schema,
          ...additionalProperties
        }
      }
    }

    return result
  }
}
