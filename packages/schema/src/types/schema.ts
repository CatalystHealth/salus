import { Context } from '../context'
import { Validation } from '../validation'

export interface Schema<A, O = A> {
  /**
   *
   */
  is(value: unknown): value is A

  /**
   *
   */
  decode(value: unknown, context: Context): Validation<A>

  /**
   *
   */
  encode(value: A): O
}

export type MixedSchema = Schema<any, any>
