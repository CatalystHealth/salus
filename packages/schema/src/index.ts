import { TypeOf, OutputOf } from './types'
import {
  ArraySchema,
  BaseSchema,
  BooleanSchema,
  EnumSchema,
  LazySchema,
  LiteralSchema,
  NullSchema,
  NumberSchema,
  ObjectSchema,
  OptionalSchema,
  Props,
  RecordSchema,
  StringSchema,
  UndefinedSchema,
  UnionSchema
} from './types/internal'
import { Schema, MixedSchema } from './types/schema'

const string = new StringSchema()
const number = new NumberSchema()
const boolean = new BooleanSchema()
const undefinedType = new UndefinedSchema()
const nullType = new NullSchema()

const literal = <E extends string>(value: E): LiteralSchema<E> => {
  return new LiteralSchema(value)
}

const lazy = <A, O = A>(name: string, getter: () => Schema<A, O>): LazySchema<A, O> => {
  return new LazySchema(getter, {
    name
  })
}

const enumType = <E extends string>(enumObject: Record<string, E>): EnumSchema<E> => {
  return new EnumSchema(enumObject)
}

const array = <A, O>(items: Schema<A, O>): ArraySchema<A, O> => {
  return new ArraySchema(items)
}

const type = <P extends Props>(props: P): ObjectSchema<P> => {
  return new ObjectSchema(props)
}

const union = <CS extends Schema<unknown>>(schemas: CS[]): UnionSchema<CS> => {
  return new UnionSchema(schemas)
}

const record = <A, O>(values: Schema<A, O>): RecordSchema<A, O> => {
  return new RecordSchema(values)
}

export {
  array,
  ArraySchema,
  boolean,
  BooleanSchema,
  enumType as enum,
  EnumSchema,
  lazy,
  LazySchema,
  literal,
  LiteralSchema,
  nullType as null,
  NullSchema,
  number,
  NumberSchema,
  record,
  RecordSchema,
  string,
  StringSchema,
  type,
  ObjectSchema,
  OptionalSchema,
  Props,
  undefinedType as undefined,
  UndefinedSchema,
  union,
  UnionSchema
}

export { TypeOf, OutputOf, Schema, MixedSchema, BaseSchema }
