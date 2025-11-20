import nextJest from 'next/jest.js';

const createJestConfig = nextJest({
  dir: './',
});

const config = {
  coverageProvider: 'v8',
  roots: ['<rootDir>/app'],
  projects: [
    {
      displayName: 'unit:client',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/app/components/__tests__/**/*.test.tsx'],
      setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
      },
    },
    {
      displayName: 'unit:server',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/app/api/**/__tests__/**/*.test.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/$1',
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
