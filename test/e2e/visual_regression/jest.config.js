process.env.JEST_PLAYWRIGHT_CONFIG = './test/e2e/visual_regression/jest-playwright.config.js';

module.exports = {
    rootDir: '../../..',
    roots: ['./test/e2e/visual_regression'],
    testMatch: ['**/?(*.)+(spec|test).[j]s'],
    testPathIgnorePatterns: ['/node_modules/'],
    testTimeout: 600000, // 10 mins
    setupFiles: ['./test/setup.js'],
    setupFilesAfterEnv: ['./test/e2e/visual_regression/jest.image.js'],
    preset: 'jest-playwright-preset',
}