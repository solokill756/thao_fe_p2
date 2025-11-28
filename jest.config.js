import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  roots: ['<rootDir>/app'],
  extensionsToTreatAsEsm: ['.ts', '.tsx'],
  projects: [
    {
      displayName: 'unit:client',
      testEnvironment: 'jsdom',
      testMatch: [
        '<rootDir>/app/components/__tests__/**/*.test.tsx',
        '<rootDir>/app/**/__tests__/**/*.test.tsx',
      ],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
      },
    },
    {
      displayName: 'unit:server',
      testEnvironment: 'node',
      testMatch: [
        '<rootDir>/app/api/**/__tests__/**/*.test.ts',
        '<rootDir>/app/actions/**/__tests__/**/*.test.ts',
      ],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
      transform: {
        '^.+\\.(ts|tsx)$': ['babel-jest', { presets: ['next/babel'] }],
      },
    },
  ],
  collectCoverageFrom: [
    'app/**/*.{js,jsx,ts,tsx}',
    '!app/**/*.d.ts',
    '!app/**/page.tsx',
    '!app/**/__tests__/**',
  ],
};

export default createJestConfig(config);
