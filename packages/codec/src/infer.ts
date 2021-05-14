import { Codec } from './codec'

export type Any = Codec<any, any>
export type Unknown = Codec<unknown, unknown>

export type TypeOf<T extends Any> = T['_A']
export type OutputOf<T extends Any> = T['_O']
