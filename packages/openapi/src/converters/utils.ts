import { BaseCodec } from '@salus-js/codec'

import { SchemaObject } from '../openapi'

export function mapRefinement<P>(
  codec: BaseCodec<any, any>,
  type: string,
  handler: (refinement: P) => Partial<SchemaObject>
): Partial<SchemaObject> {
  return (
    codec.options.refinements?.reduce(
      (extensions, refinement) =>
        refinement.type === type ? { ...extensions, ...handler(refinement.arguments) } : extensions,
      {}
    ) ?? {}
  )
}
