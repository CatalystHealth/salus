import { ArrayConverter } from './array'
import { BooleanConverter } from './boolean'
import { DateConverter } from './date'
import { EnumConverter } from './enum'
import { LiteralConverter } from './literal'
import { NullableConverter } from './nullable'
import { NumberConverter } from './number'
import { ObjectConverter } from './object'
import { RecordConverter } from './record'
import { StringConverter } from './string'
import { UnionConverter } from './union'

export const defaultConverters = [
  ArrayConverter,
  BooleanConverter,
  DateConverter,
  NullableConverter,
  NumberConverter,
  ObjectConverter,
  LiteralConverter,
  StringConverter,
  UnionConverter,
  RecordConverter,
  EnumConverter
]
