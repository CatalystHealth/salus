export type Refinement<A, P> = {
  constraint: Constraint<A, P>
  type?: string
  message?: string
  arguments?: P
}

export type RefinementOptions<A, P> = Omit<Refinement<A, P>, 'constraint'>

export type Constraint<A, P = void> = (value: A, args: P) => boolean
