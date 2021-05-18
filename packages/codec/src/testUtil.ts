import { Codec } from './codec'
import { Any } from './infer'

export type ExpectedFailure = [string, string]

export interface SuccessfulExpectation {
  description: string
  codec: Any
  input: unknown
  success: true
  value: unknown
}

export interface UnsuccessfulExpectation {
  description: string
  codec: Any
  input: unknown
  success: false
  errors: ExpectedFailure[]
}

export function createSuccessfulExpectation<T>(
  description: string,
  codec: Codec<T, any>,
  input: unknown,
  value: T
): SuccessfulExpectation {
  return {
    description,
    codec,
    input,
    success: true,
    value
  }
}

export function createFailureExpectation(
  description: string,
  codec: Codec<any, any>,
  input: unknown,
  ...errors: ExpectedFailure[]
): UnsuccessfulExpectation {
  return {
    description,
    codec,
    input,
    success: false,
    errors
  }
}

export function verifyExpectation(
  expectation: SuccessfulExpectation | UnsuccessfulExpectation
): void {
  const { codec, input } = expectation

  const result = codec.decode(input)
  if (expectation.success && result.success) {
    expect(result.value).toEqual(expectation.value)
  } else if (!expectation.success && !result.success) {
    expect(result.errors.map(({ path, message }) => [path.join('.'), message])).toEqual(
      expectation.errors
    )
  } else {
    expect(result.success).toEqual(expectation.success)
  }
}

export function executeDecodeTests(
  cases: Array<SuccessfulExpectation | UnsuccessfulExpectation>
): void {
  for (const testCase of cases) {
    test(testCase.description, () => verifyExpectation(testCase))
  }
}
