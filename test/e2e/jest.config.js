module.exports = {
    rootDir: '../..',
    roots: ['./test', './'],
    testMatch: ['**/?(*.)+(spec|test).[j]s'],
    testPathIgnorePatterns: ['/node_modules/', './test/e2e/visual_regression/'],
    setupFiles: ['./test/setup.js'],
}