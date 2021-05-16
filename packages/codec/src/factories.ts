import { Codec } from './codec'
import {
  ArrayCodec,
  NumberCodec,
  StringCodec,
  LiteralCodec,
  ObjectCodec,
  Props,
  BooleanCodec,
  EnumCodec,
  Partialize,
  DateCodec,
  BaseCodec
} from './types'

const boolean = new BooleanCodec()
const date = new DateCodec()
const number = new NumberCodec()
const string = new StringCodec()

function enumFactory<T extends string>(value: Record<string, T>): EnumCodec<T> {
  return new EnumCodec(value)
}

function literal<T extends string>(value: T): LiteralCodec<T> {
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

function named<C extends BaseCodec<any, any>>(name: string, codec: C): C {
  return codec.named(name)
}

export {
  array,
  boolean,
  date,
  enumFactory as enum,
  literal,
  named,
  number,
  object,
  partial,
  string
}
