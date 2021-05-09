declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveValidationSuccess(value: unknown): R
      toHaveValidationFailure(path: string[], message: string): R
    }
  }
}

export {}
