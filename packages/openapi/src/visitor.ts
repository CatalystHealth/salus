import { BaseCodec, Codec, OptionalCodec } from '@salus-js/codec'

import { SchemaConverter } from './converter'
import { defaultConverters } from './converters'
import { ReferenceObject, SchemaObject } from './openapi'

interface SchemaVisitorOptions {
  readonly converters: SchemaConverter[]
  readonly namedSchemaVisitor?: (name: string, generate: () => SchemaObject) => void
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
    const actualCodec = codec instanceof OptionalCodec ? codec.innerCodec : codec
    const name = this.isBaseCodec(actualCodec) ? actualCodec.options.name : null
    if (name) {
      if (this.options.namedSchemaVisitor) {
        this.options.namedSchemaVisitor(name, () => this.doConvert(actualCodec))
      }

      return { $ref: `#${this.options.referenceRoot || ''}/${name}` }
    }

    return this.doConvert(actualCodec)
  }

  private doConvert(codec: Codec<any>): SchemaObject {
    let index = 0
    const next = () => {
      if (index > this.options.converters.length - 1) {
        throw new Error(`No converter was able to convert the codec ${codec.constructor.name}`)
      }

      return this.options.converters[index++].convert(codec, this, next)
    }

    return next()
  }

  private isBaseCodec(codec: Codec<any>): codec is BaseCodec<any> {
    return codec instanceof BaseCodec
  }
}