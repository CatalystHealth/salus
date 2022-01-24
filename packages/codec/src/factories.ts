import { Codec } from './codec'
import { Any } from './infer'
import {
  ArrayCodec,
  BooleanCodec,
  ConcreteCodec,
  EnumCodec,
  IsoDateCodec,
  IsoDateTimeCodec,
  LazyCodec,
  LiteralCodec,
  LiteralValue,
  NullCodec,
  NumberCodec,
  ObjectCodec,
  Partialize,
  Props,
  RecordCodec,
  StringCodec,
  TupleCodec,
  UndefinedCodec,
  UnknownCodec
} from './types'
import { UnionCodec } from './types/union'

const boolean = new BooleanCodec()
const number = new NumberCodec()
const string = new StringCodec()
const trimmedString = new StringCodec().trim()
const nullType = new NullCodec()
const unknown = new UnknownCodec()
const undefinedType = new UndefinedCodec()

const isoDate = new IsoDateCodec()
const isoDateTime = new IsoDateTimeCodec()

function enumFactory<T extends string>(value: Record<string, T> | ReadonlyArray<T>): EnumCodec<T> {
  return new EnumCodec(value)
}

function literal<T extends LiteralValue>(value: T): LiteralCodec<T> {
  return new LiteralCodec(value)
}

function array<A, O>(codec: Codec<A, O>): ArrayCodec<A, O> {
  return new ArrayCodec(codec)
}

function object<P extends Props>(props: P): ObjectCodec<P> {
  return new ObjectCodec(props)
}

function partial<P extends Props>(codec: P): ObjectCodec<Partialize<P>> {
  return ObjectCodec.partial(codec)
}

function named<A, O>(name: string, codec: Codec<A, O>): ConcreteCodec<A, O> {
  return new ConcreteCodec(name, codec)
}

function union<CS extends [Any, Any, ...Any[]]>(codecs: CS): UnionCodec<CS> {
  return new UnionCodec(codecs)
}

function lazy<A, O = A>(resolver: () => Codec<A, O>): LazyCodec<A, O> {
  return new LazyCodec(resolver)
}

function record<K extends Any, V extends Any>(key: K, value: V): RecordCodec<K, V> {
  return new RecordCodec(key, value)
}

function tuple<A extends Any, B extends Any, C extends Any, D extends Any, E extends Any>(
  codecs: [A, B, C, D, E]
): TupleCodec<[A, B, C, D, E]>
function tuple<A extends Any, B extends Any, C extends Any, D extends Any>(
  codecs: [A, B, C, D]
): TupleCodec<[A, B, C, D]>
function tuple<A extends Any, B extends Any, C extends Any>(
  codecs: [A, B, C]
): TupleCodec<[A, B, C]>
function tuple<A extends Any, B extends Any>(codecs: [A, B]): TupleCodec<[A, B]>
function tuple<A extends Any>(codecs: [A], name?: string): TupleCodec<[A]>
function tuple<A extends Any[]>(codecs: A): TupleCodec<A> {
  return new TupleCodec(codecs)
}

export {
  array,
  boolean,
  enumFactory as enum,
  isoDate,
  isoDateTime,
  lazy,
  literal,
  named,
  nullType as null,
  number,
  object,
  partial,
  record,
  string,
  trimmedString,
  tuple,
  undefinedType as undefined,
  unknown,
  union
}
