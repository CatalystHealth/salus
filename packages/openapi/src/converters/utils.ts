import { BaseCodec } from '@salus-js/codec'

import { SchemaObject } from '../openapi'

export function mapRefinement<P>(
  codec: BaseCodec<any, any>,
  type: string,
  handler: (refinement: P) => Partial<SchemaObject>
): Partial<SchemaObject> {
  const refinement = codec.options.refinements?.find((refinement) => refinement.type === type)
  if (!refinement) {
    return {}
  }

  return handler(refinement.arguments)
}
