const commonConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest/jest-env.ts']
}

module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: ['<rootDir>/jest/jest-env.ts'],
  projects: [
    {
      preset: 'ts-jest',
      displayName: 'schema',
      testMatch: ['<rootDir>/packages/schema/**/*.spec.ts'],
      ...commonConfig
    },
    {
      preset: 'ts-jest',
      displayName: 'openapi',
      testMatch: ['<rootDir>/packages/openapi/**/*.spec.ts'],
      ...commonConfig
    }
  ]
}
