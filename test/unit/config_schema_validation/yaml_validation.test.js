const fs = require('fs')
const yaml = require('js-yaml');
const { matchers } = require('jest-json-schema');
expect.extend(matchers);

const SCHEMA_DIR = global.BASE_DIR + '/test/unit/config_schema_validation/schemas/';

describe('Yaml config validation', () => {
    it(`Main config file should validate against schema`, () => {
        const schema = require(SCHEMA_DIR + 'main_config.json')
        const fileContents = yaml.load(fs.readFileSync(global.MAIN_CONFIG_FILE, 'utf8'));

        expect(fileContents).toMatchSchema(schema);
    });

    it(`Tempate config files should validate against schema`, () => {
        const schema = require(SCHEMA_DIR + 'output_config.json')

        for (const filename of global.CONFIG_FILES) {
            const fileContents = yaml.load(fs.readFileSync(filename, 'utf8'));
            expect(fileContents).toMatchSchema(schema);
        }
    });

    it(`Navigation config file should validate against schema`, () => {
        const schema = require(SCHEMA_DIR + 'nav.json')
        const fileContents = yaml.load(fs.readFileSync(global.NAVIGATION_FILE, 'utf8'));

        expect(fileContents).toMatchSchema(schema);
    });

    it(`Settings config file should validate against schema`, () => {
        const schema = require(SCHEMA_DIR + 'empty.json')
        const fileContents = yaml.load(fs.readFileSync(global.SETTINGS_FILE, 'utf8'));

        expect(fileContents).toMatchSchema(schema);
    });

    it(`Meta config file should validate against schema`, () => {
        const schema = require(SCHEMA_DIR + 'empty.json')
        const fileContents = yaml.load(fs.readFileSync(global.META_FILE, 'utf8'));

        expect(fileContents).toMatchSchema(schema);
    });

    it(`Locales config file should validate against schema`, () => {
        const schema = require(SCHEMA_DIR + 'empty.json')
        const fileContents = yaml.load(fs.readFileSync(global.LOCALES_FILE, 'utf8'));

        expect(fileContents).toMatchSchema(schema);
    });

    it(`Images config file should validate against schema`, () => {
        const schema = require(SCHEMA_DIR + 'empty.json')
        const fileContents = yaml.load(fs.readFileSync(global.IMAGES_FILE, 'utf8'));

        expect(fileContents).toMatchSchema(schema);
    });

});
