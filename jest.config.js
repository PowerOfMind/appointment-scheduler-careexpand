// jest.config.js
module.exports = {
  preset: 'jest-expo',
  setupFilesAfterEnv: [ '@testing-library/jest-native/extend-expect' ],
  transform: {
    '^.+\\.(js|ts|tsx)$': 'babel-jest',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(expo|@expo|react-native|@react-native|@react-navigation|@unimodules|expo-modules-core)/)',
  ],
  moduleFileExtensions: [ 'ts', 'tsx', 'js', 'jsx', 'json', 'node' ],
  testEnvironment: 'node',
};
