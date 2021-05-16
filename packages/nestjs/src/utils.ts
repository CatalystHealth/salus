import { Operation } from '@salus-js/http'

import { OPERATION_METADATA_KEY } from './constants'

/**
 * Returns the Salus operation associated with a given function
 *
 * @param method the method to check
 * @returns the associated operation if one exists
 */
export function getOperaton(method: Function): Operation | null {
  return Reflect.getMetadata(OPERATION_METADATA_KEY, method) || null
}
