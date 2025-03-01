export default {
  testEnvironment: 'jest-environment-jsdom', // Используем jest-environment-jsdom
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json'],
  transform: {
    '^.+\\.(ts|tsx)$': 'babel-jest', // Трансформация TypeScript
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Настройки
  extensionsToTreatAsEsm: ['.ts', '.tsx'], // Указываем ESM
};