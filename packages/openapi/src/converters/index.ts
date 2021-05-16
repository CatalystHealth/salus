import { ArrayConverter } from './array'
import { BooleanConverter } from './boolean'
import { DateConverter } from './date'
import { LiteralConverter } from './literal'
import { NullableConverter } from './nullable'
import { NumberConverter } from './number'
import { ObjectConverter } from './object'
import { StringConverter } from './string'

export const defaultConverters = [
  ArrayConverter,
  BooleanConverter,
  DateConverter,
  NullableConverter,
  NumberConverter,
  ObjectConverter,
  LiteralConverter,
  StringConverter
]
