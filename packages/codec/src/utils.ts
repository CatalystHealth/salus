import { OptionalCodec } from './types'

export type OptionalKeys<T extends object> = {
  [K in keyof T]: T[K] extends OptionalCodec<any, any> ? K : never
}[keyof T]
export type Optionalize<T extends object, O extends keyof T> = Pick<T, Exclude<keyof T, O>> &
  {
    [K in O]?: T[K]
  }

/**
 * Checks if an object is a generic record
 *
 * @param value the value to check
 * @returns true if it's a check record
 */
export function isRecord(value: unknown): value is Record<string, unknown> {
  const s = Object.prototype.toString.call(value)
  return s === '[object Object]' || s === '[object Window]'
}
