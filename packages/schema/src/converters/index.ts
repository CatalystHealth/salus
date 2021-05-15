import { ArrayConverter } from './array'
import { DateConverter } from './date'
import { LiteralConverter } from './literal'
import { NumberConverter } from './number'
import { ObjectConverter } from './object'
import { StringConverter } from './string'

export const defaultConverters = [
  ArrayConverter,
  DateConverter,
  NumberConverter,
  ObjectConverter,
  LiteralConverter,
  StringConverter
]
