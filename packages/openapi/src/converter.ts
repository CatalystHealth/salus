import { Codec } from '@salus-js/codec'

import type { ReferenceObject, SchemaObject } from './openapi'
import { SchemaVisitor } from './visitor'

export interface SchemaConverter {
  /**
   * Converts a codec into an OpenAPI schema
   *
   * @param codec the codec to convert
   * @param visitor the schema visitor to call for any children
   * @param next pass to the next converter in the chain
   * @return the converted schema
   */
  convert(
    codec: Codec<any>,
    visitor: SchemaVisitor,
    next: () => SchemaObject
  ): SchemaObject | ReferenceObject
}
