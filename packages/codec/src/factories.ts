import { Codec } from './codec'
import {
  ArrayCodec,
  NumberCodec,
  StringCodec,
  LiteralCodec,
  ObjectCodec,
  Props,
  BooleanCodec
} from './types'

export const string = new StringCodec()
export const number = new NumberCodec()
export const boolean = new BooleanCodec()

export function literal<T extends string>(value: T): LiteralCodec<T> {
  return new LiteralCodec(value)
}

export function array<A, O>(codec: Codec<A, O>): ArrayCodec<A, O> {
  return new ArrayCodec(codec)
}

export function object<P extends Props>(props: P): ObjectCodec<P> {
  return new ObjectCodec(props)
}
