import { Operation } from './operation'

/**
 * Extracts the parameter type from an operation
 */
export type ParamsOf<T extends Operation> = T['_P']

/**
 * Extracts the query type from an operation
 */
export type QueryOf<T extends Operation> = T['_Q']

/**
 * Extracts the body type from an operation
 */
export type BodyOf<T extends Operation> = T['_B']

/**
 * Extracts the response type from an operation
 */
export type ResponseOf<T extends Operation> = T['_R']