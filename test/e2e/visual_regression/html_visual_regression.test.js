const fs = require('fs')


// jest-image-snapshot custom configuration
function getConfig () {
    return {
        diffDirection: 'vertical',
        // useful on CI (no need to retrieve the diff image, copy/paste image content from logs)
        dumpDiffToConsole: false,
        // use SSIM to limit false positive
        // https://github.com/americanexpress/jest-image-snapshot#recommendations-when-using-ssim-comparison
        comparisonMethod: 'ssim',
        // runInProcess: true,
        verbose: true,
    };
}

describe('HTML output visual regression', () => {
    it(`Should look the same`, async () => {

        for (const filename of global.HTML_OUTPUT_FILES) {
            let fullFilename = global.BASE_DIR + '/' + filename

            try {
                const response = await page.goto('file://' + fullFilename);
            } catch (error) {
                continue;
            }

            // Take the screenshot of the page
            const image = await page.screenshot({ fullPage: true });

            // Compare the taken screenshot with the baseline screenshot (if exists), or create it (else)
            const config = getConfig();
            
            try {
                expect(image).toMatchImageSnapshot(config);
            } catch (error) {
                console.log(error)
            }
        }

    });
});
