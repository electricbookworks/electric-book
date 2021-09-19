module.exports = {
    rootDir: '../..',
    roots: ['./test', './'],
    testMatch: ['**/?(*.)+(spec|test).[j]s'],
    testPathIgnorePatterns: ['/node_modules/'],
    setupFiles: ['./test/setup.js'],
    // exclude long running "optional" test suites
    modulePathIgnorePatterns: ['visual_regression']
}
