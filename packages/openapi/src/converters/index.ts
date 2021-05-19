import { ArrayConverter } from './array'
import { BooleanConverter } from './boolean'
import { EnumConverter } from './enum'
import { IsoDateConverter } from './isoDate'
import { IsoDateTimeConverter } from './isoDateTime'
import { LazyConverter } from './lazy'
import { LiteralConverter } from './literal'
import { NullableConverter } from './nullable'
import { NumberConverter } from './number'
import { ObjectConverter } from './object'
import { OptionalConverter } from './optional'
import { RecordConverter } from './record'
import { ReferenceConverter } from './reference'
import { StringConverter } from './string'
import { UnionConverter } from './union'
import { UnknownConverter } from './unknown'

export const defaultConverters = [
  ArrayConverter,
  BooleanConverter,
  IsoDateConverter,
  IsoDateTimeConverter,
  NullableConverter,
  NumberConverter,
  ObjectConverter,
  LiteralConverter,
  StringConverter,
  UnionConverter,
  RecordConverter,
  EnumConverter,
  UnknownConverter,
  ReferenceConverter,
  LazyConverter,
  OptionalConverter
]
