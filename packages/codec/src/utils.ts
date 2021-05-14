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
