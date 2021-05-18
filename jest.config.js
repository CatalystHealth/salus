const path = require('path') // eslint-disable-line

module.exports.commonJestConfig = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  setupFilesAfterEnv: [path.join(__dirname, 'jest', 'jest-env.ts')]
}
