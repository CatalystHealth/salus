import { Codec } from './codec'
import { Any } from './infer'

export type ExpectedFailure = [string, string]

export interface SuccessfulDecodeExpectation {
  description: string
  codec: Any
  input: unknown
  success: true
  value: unknown
}

export interface UnsuccessfulDecodeExpectation {
  description: string
  codec: Any
  input: unknown
  success: false
  errors: ExpectedFailure[]
}

export interface EncodeExpectation {
  description: string
  codec: Any
  input: unknown
  value: unknown
}

export function decodeSuccessExpectation<T>(
  description: string,
  codec: Codec<T, any>,
  input: unknown,
  value: T
): SuccessfulDecodeExpectation {
  return {
    description,
    codec,
    input,
    success: true,
    value
  }
}

export function decodeFailureExpectation(
  description: string,
  codec: Codec<any, any>,
  input: unknown,
  ...errors: ExpectedFailure[]
): UnsuccessfulDecodeExpectation {
  return {
    description,
    codec,
    input,
    success: false,
    errors
  }
}

export function encodeExpectation(
  description: string,
  codec: Codec<any, any>,
  input: unknown,
  value: unknown
): EncodeExpectation {
  return {
    description,
    codec,
    input,
    value
  }
}

export function verifyExpectation(
  expectation: SuccessfulDecodeExpectation | UnsuccessfulDecodeExpectation
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
  cases: Array<SuccessfulDecodeExpectation | UnsuccessfulDecodeExpectation>
): void {
  for (const testCase of cases) {
    test(testCase.description, () => verifyExpectation(testCase))
  }
}

export function executeEncodeTests(cases: Array<EncodeExpectation>): void {
  for (const testCase of cases) {
    test(testCase.description, () => {
      expect(testCase.codec.encode(testCase.input)).toEqual(testCase.value)
    })
  }
}
