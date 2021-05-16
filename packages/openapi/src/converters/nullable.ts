import { NullableCodec } from '@salus-js/codec'

import { isReferenceObject } from '../openapi'

import { SimpleConverter } from './simple'

export const NullableConverter = SimpleConverter.for(NullableCodec, (codec, visitor) => {
  const referenced = visitor.convert(codec.innerCodec)
  if (isReferenceObject(referenced)) {
    return {
      oneOf: [referenced],
      nullable: true
    }
  }

  return {
    ...referenced,
    nullable: true
  }
})
