const yaml = require('js-yaml');
const fs   = require('fs');
const path = require('path');
const { exit } = require('process');


const getTemplateHtmlFiles = (works) => {
    let files = [];
    works.forEach((w) => {
        let primaryLanguageFiles = w["products"]["web"]["files"].map((f) => {
            let filename = (typeof f === 'object') ? Object.keys(f)[0] : f;

            return '_site/' + w.directory + '/text/' + filename + '.html';
        })

        let translationFiles = [];
        if ("translations" in w) {
            w["translations"].forEach((t) => {
                let t_files = t["products"]["web"]["files"].map((f) => {
                    let filename = (typeof f === 'object') ? Object.keys(f)[0] : f;

                    return '_site/' + w.directory + '/' + t.directory + '/text/' + filename + '.html'
                })
                translationFiles.push(...t_files);
            })
        }

        files.push(...primaryLanguageFiles)
        files.push(...translationFiles)
    })

    return files
}

const getTemplateConfigFiles = (baseDir) => {
    const configDir = baseDir + '/_configs';
    const dirContents = fs.readdirSync(configDir);
    
    let files = dirContents.filter(
        (item) => { return item.match(/.*\.(yml|yaml?)/ig); }
    ).map(
        (file) => { return configDir + '/' + file; }
    );

    return files;
}


global.BASE_DIR = path.dirname(__dirname)

global.META = yaml.load(fs.readFileSync(global.BASE_DIR + '/_data/meta.yml', 'utf8'));

global.HTML_OUTPUT_FILES = getTemplateHtmlFiles(global.META['works'])

global.MAIN_CONFIG_FILE = global.BASE_DIR + '/_config.yml'
global.CONFIG_FILES = getTemplateConfigFiles(global.BASE_DIR)
global.NAVIGATION_FILE = global.BASE_DIR + '/_data/nav.yml';
global.SETTINGS_FILE = global.BASE_DIR + '/_data/settings.yml';
global.META_FILE = global.BASE_DIR + '/_data/meta.yml';
global.LOCALES_FILE = global.BASE_DIR + '/_data/locales.yml';
global.IMAGES_FILE = global.BASE_DIR + '/_data/images.yml';
