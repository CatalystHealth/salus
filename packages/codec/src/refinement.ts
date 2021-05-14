/**
 * Function that constrains a value to a certain criteria
 */
export type Constraint<A, P = void> = (value: A, args: P) => boolean

export interface Refinement<A, P> {
  /**
   * Constraint that this refinement executes
   */
  readonly constraint: Constraint<A, P>

  /**
   * Type of refinement which can be used by documentation generators
   */
  readonly type?: string

  /**
   * Message to attach if this constraint fails
   */
  readonly message?: string

  /**
   * Arguments to pass into the constraint method
   */
  readonly arguments?: P
}

/**
 * Options to attach when creating a refinement
 */
export type RefinementOptions<A, P> = Omit<Refinement<A, P>, 'constraint'>
