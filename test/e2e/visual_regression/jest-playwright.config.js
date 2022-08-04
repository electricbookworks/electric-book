module.exports = {
    launch: {
        headless: process.env.HEADLESS !== 'false',
        slowMo: process.env.SLOWMO ? process.env.SLOWMO : 0,
    },
    launchType: 'LAUNCH',
    contextOptions: {
        viewport: {
            width: 1920,
            height: 1080,
        },
    },
    browsers: ['chromium'], // 'webkit', 'firefox'
};
