/**
 * Preprocesses incoming values on a codec before decoding
 */
export type Preprocessor = (value: unknown) => unknown
