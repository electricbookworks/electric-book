const fs = require('fs')

describe('HTML output', () => {
    it(`Files listed in meta.yml should exist`, async () => {
        for (const filename of global.HTML_OUTPUT_FILES) {
            let fullFilename = global.BASE_DIR + '/' + filename
            try {
                expect(fs.existsSync(fullFilename)).toBe(true);
            } catch (error) {
                throw new Error(`File '${fullFilename}' should exist.`)
            }
        }
    });
});
