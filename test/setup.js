const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path')


global.BASE_DIR = path.dirname(__dirname)

try {
    global.META = yaml.load(fs.readFileSync(global.BASE_DIR + '/_data/meta.yml', 'utf8'));

    let files = [];
    global.META['works'].forEach((w) => {
        let primary_language_files = w["products"]["web"]["files"].map((f) => {
            let filename = (typeof f === 'object') ? Object.keys(f)[0] : f;

            return '_site/' + w.directory + '/text/' + filename + '.html';
        })

        let translation_files = [];
        if ("translations" in w) {
            w["translations"].forEach((t) => {
                let t_files = t["products"]["web"]["files"].map((f) => {
                    let filename = (typeof f === 'object') ? Object.keys(f)[0] : f;

                    return '_site/' + w.directory + '/' + t.directory + '/text/' + filename + '.html'
                })
                translation_files.push(...t_files);
            })
        }

        files.push(...primary_language_files)
        files.push(...translation_files)
    })
    global.HTML_OUTPUT_FILES = files

} catch (e) {
    console.log(e);
}
