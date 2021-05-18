const { commonJestConfig } = require('../../jest.config') // eslint-disable-line

module.exports = {
  ...commonJestConfig,
  testMatch: ['<rootDir>/src/**/*.spec.ts']
}
