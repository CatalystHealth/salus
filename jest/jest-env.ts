import fastDeepEqual from 'fast-deep-equal'

import { Validation } from '../packages/codec/src/validation'

expect.extend({
  toHaveValidationSuccess: (value: Validation<unknown>, expected: unknown) => {
    const validation = value
    if (!validation.success) {
      return {
        pass: false,
        message: () => 'expected valid result, but result was invalid'
      }
    }

    return {
      pass: fastDeepEqual(validation.value, expected),
      message: () => `expected ${validation.value as string} to equal ${expected as string}`
    }
  },
  toHaveValidationFailure: (validation: Validation<unknown>, path: string[], message: string) => {
    if (validation.success) {
      return {
        pass: false,
        message: () => 'expected invalid result, but result was valid'
      }
    }

    const hasValidFailure = validation.errors.some(
      (error) => fastDeepEqual(error.path, path) && error.message === message
    )

    if (!hasValidFailure) {
      return {
        pass: hasValidFailure,
        message: () =>
          `watching for failure on: ${path.join('.')}; known errors: ${validation.errors
            .map((error) => `${error.path.join('.')}: ${error.message || ''}`)
            .join('\n')}`
      }
    }

    return {
      pass: true,
      message: () => ''
    }
  }
})
