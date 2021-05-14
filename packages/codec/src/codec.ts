import { Context } from './context'
import { Validation } from './validation'

export abstract class Codec<A, O = A> {
  /**
   * Unique string tag to identify this codec
   */
  abstract readonly _tag: string

  /**
   * Phantom key used to capture the runtime type
   */
  readonly _A!: A

  /**
   * Phantom key used to capture the wire type
   */
  readonly _O!: O

  /**
   * Verifies that the given value conforms to the expected runtime type
   *
   * @param value the value to validate against the schema
   * @param context the context to use when encoding the value (creates new by default)
   * @return true if valid (includes a typecast)
   */
  abstract is(value: unknown): value is A
  abstract is(value: unknown, context: Context): value is A

  /**
   * Encodes a value to its corresponding wire type
   *
   * For performance reasons, this method assumes the value already conforms
   * to the expected runtime type. The type checker should help you verify this,
   * but if you're not sure if this is the case, you should confirm by calling
   * `.is()` yourself.
   *
   * @param value the value that should be encoded
   * @param context the context to use when encoding the value (creates new by default)
   * @returns the result of running the encoding
   */
  abstract encode(value: A): O
  abstract encode(value: A, context: Context): O

  /**
   * Decodes a value from its corresponding wire type
   *
   * This method returns a discriminated union based on whether the validation was
   * successful or not. If successful, the appropriate runtime value is returned. If
   * unsuccessful, an array of errors are returned.
   *
   * @param value the value that should be decoded
   * @param context the context to use when encoding the value (creates new by default)
   * @returns the result of running the decoding
   */
  abstract decode(value: unknown): Validation<A>
  abstract decode(value: unknown, context: Context): Validation<A>
}
