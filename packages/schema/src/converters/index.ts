import { ArrayConverter } from './array'
import { LiteralConverter } from './literal'
import { ObjectConverter } from './object'
import { StringConverter } from './string'

export const defaultConverters = [
  ArrayConverter,
  ObjectConverter,
  LiteralConverter,
  StringConverter
]
