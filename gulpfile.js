/*jslint node, for, this */
/*globals async */

// This gulpfile processes:
// - images, optimising them for output formats
// - Javascript, optionally, minifying scripts for performance
// - HTML, rendering MathJax as MathML.
// It takes two arguments: --book and --language, e.g.:
// gulp --book samples --language fr

// Get Node modules
var gulp = require('gulp'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    newer = require('gulp-newer'),
    gm = require('gulp-gm'),
    svgmin = require('gulp-svgmin'),
    args = require('yargs').argv,
    fileExists = require('file-exists'),
    mathjax = require('gulp-mathjax-page'),
    fs = require('fs'),
    yaml = require('js-yaml'),
    debug = require('gulp-debug'),
    del = require('del'),
    cheerio = require('gulp-cheerio'),
    tap = require('gulp-tap'),
    iconv = require('iconv-lite'),
    gulpif = require('gulp-if');

    // Utilities copied from elsewhere in this repo
    var { ebSlugify } = require('./assets/js/utilities.js');
    var { printpdfIndexTargets } = require('./assets/js/book-index-print-pdf.js');
    var { screenpdfIndexTargets } = require('./assets/js/book-index-screen-pdf.js');
    var { epubIndexTargets } = require('./assets/js/book-index-epub.js');
    var { appIndexTargets } = require('./assets/js/book-index-app.js');

    // Get the file list from search-store.js,
    // which is included in search-engine.js.
    // The store includes a list of all pages
    // that Jekyll parsed when last building.
    var { store } = require('./_site/assets/js/search-engine.js');

// A function for loading book metadata as an object
function loadMetadata() {
    'use strict';

    var paths = [];
    var filePaths = [];
    var books = [];
    var languages = [];

    if (fileExists.sync('_data/meta.yml')) {

        var metadata = yaml.load(fs.readFileSync('_data/meta.yml', 'utf8'));
        var works = metadata.works;

        var i;
        var j;
        for (i = 0; i < works.length; i += 1) {
            books.push(works[i].directory);
            paths.push('_site/' + works[i].directory + '/text/');
            filePaths.push('_site/' + works[i].directory + '/text/*.html');
            if (works[i].translations) {
                for (j = 0; j < works[i].translations.length; j += 1) {
                    languages.push(works[i].translations[j].directory);
                    paths.push('_site/' + works[i].directory + '/' + works[i].translations[j].directory + '/text/');
                    filePaths.push('_site/' + works[i].directory + '/' + works[i].translations[j].directory + '/text/*.html');
                }
            }
        }
    }

    return {
        books: books,
        languages: languages,
        paths: paths,
        filePaths: filePaths
    };
}

// Load image settings if they exist
var imageSettings = [];
if (fs.existsSync('_data/images.yml')) {
    imageSettings = yaml.load(fs.readFileSync('_data/images.yml', 'utf8'));

    // If the file is empty, imageSettings will be null.
    // So we check for that and, if null, we create an array.
    if (!imageSettings) {
        imageSettings = [];
    }
}

// Get the book we're processing
var book = 'book';
if (args.book && args.book.trim() !== '') {
    book = args.book;
}

// let '--folder' be an alias for '--book',
// to make sense for gulping 'assets'
if (args.folder && args.folder.trim() !== '') {
    book = args.folder;
}

// Reminder on usage
if (book === 'book') {
    console.log('If processing images for a book that\'s not in the /book directory, use the --book argument, e.g. gulp --book potatoes');
    console.log('To process images in assets, use gulp --folder assets');
}

// Get the language we're processing
var language = '';
if (args.language && args.language.trim() !== '') {
    language = '/' + args.language;
}

// Reminder on usage
if (language === '') {
    console.log('If processing a translation\'s images, use the --language argument, e.g. gulp --language fr');
}

// Get the output format we're working with
var output = '';
if (args.output && args.output.trim() !== '') {
    output = args.output;
}

// Reminder on usage
if (output === '') {
    console.log('If processing for a specific output, use the --output argument, e.g. gulp --output printpdf. No hyphens.');
}

// Create array of all text files in all books
var allTextPaths = function (store) {
    'use strict';
    var paths = [];
    store.forEach(function (entry) {
        paths.push('_site/' + entry.url);
    })
    return paths;
}

// Set up paths.
// Paths to text src must include the *.html extension.
// Add paths to any JS files to minify to the src array, e.g.
// src: ['assets/js/foo.js,assets/js/bar.js'],
var paths = {
    img: {
        source: book + language + '/images/_source/',
        printpdf: book + language + '/images/print-pdf/',
        web: book + language + '/images/web/',
        screenpdf: book + language + '/images/screen-pdf/',
        epub: book + language + '/images/epub/',
        app: book + language + '/images/app/'
    },
    text: {
        src: '_site/' + book + language + '/text/*.html',
        dest: '_site/' + book + language + '/text/'
    },
    epub: {
        src: '_site/epub/' + book + language + '/text/*.html',
        dest: '_site/epub/' + book + language + '/text/'
    },
    js: {
        src: [],
        dest: 'assets/js/'
    },
    yaml: {
        src: ['*.yml', '_configs/*.yml', '_data/*.yml']
    },
    // Arrays of globs to ignore from tasks
    ignore: {
        printpdf: ['**/favicon.*'],
        web: [],
        screenpdf: ['**/favicon.*'],
        epub: ['**/favicon.*'],
        app: ['**/favicon.*']
    }
};

// Set filetypes to convert, comma separated, no spaces
var filetypes = 'jpg,jpeg,gif,png';

// Default color settings
var defaultColorProfile = 'sRGB_v4_ICC_preference_displayclass.icc';
var defaultColorSpace = 'rgb';
var defaultColorProfileGrayscale = 'Grey_Fogra39L.icc';
var defaultColorSpaceGrayscale = 'gray';
var defaultOutputFormat = 'web';

// Function for checking if an image should be processed
function modifyImageCheck(filename, format) {

    // Assume true
    var modifyImage = true;

    if (!format) {
        format = 'all';
    }

    if (imageSettings[book]) {
        imageSettings[book].forEach(function (image) {
            if (image.file === filename) {

                // User feedback for images not being modified
                var noModifyFeedback = filename + " not modified for " + format + " format(s), as specified in images.yml";

                // We use the same SVG for all output formats. So:
                // if this is an SVG, do *any* of the output formats
                // have 'modify' set to no? If so, do not modify it.
                if (filename.match(/[^\s]+\.svg$/gi)) {
                    var outputFormats = ['print-pdf', 'screen-pdf', 'web', 'epub', 'app', 'all'];
                    outputFormats.forEach(function (format) {
                        if (image[format] && image[format].modify && image[format].modify === 'no') {
                            console.log(noModifyFeedback);
                            modifyImage = false;
                        }
                    })
                }

                // If an image has a 'modify' setting for this or all formats...
                if (image.modify || (image[format] && image[format].modify)
                        || (image.all && image.all.modify)) {

                    // ... and it's set to no, do not modify.
                    if (image.modify === 'no' || (image[format] && image[format].modify === 'no')
                            || (image.all && image.all.modify === 'no')) {
                        console.log(noModifyFeedback);
                        modifyImage = false;
                    }
                }
            }
        })
    }

    return modifyImage;
}

// Function for getting a filename in gulp tap
function getFilenameFromPath(path) {
    filename = path.split('\/').pop(); // for unix slashes
    filename = filename.split('\\').pop(); // for windows backslashes
    return filename;
}

// Function for default gulp tap step
function getFileDetailsFromTap(file, format) {

    if (!format) {
        format = 'all';
    }

    return {
        prefix: file.basename.replace('.', '').replace(' ', ''),
        filename: getFilenameFromPath(file.path),
        modifyImage: modifyImageCheck(filename, format)
    }
}

function lookupColorSettings(gmfile,
        colorProfile, colorSpace,
        colorProfileGrayscale, colorSpaceGrayscale,
        outputFormat) {

    var filename = getFilenameFromPath(gmfile.source);

    // Look up image settings
    if (imageSettings[book]) {
        imageSettings[book].forEach(function (image) {
            if (image.file === filename || image.file == "all") {
                if (image[outputFormat] && image[outputFormat].colorspace === 'gray') {
                    colorProfile = colorProfileGrayscale;
                    colorSpace = colorSpaceGrayscale;
                }
            }
        });
    }

    return {
        colorSpace: colorSpace,
        colorProfile: colorProfile
    }
}

// Minify and clean SVGs and copy to destinations.
// For EpubCheck-safe SVGs, we remove data- attributes
// and don't strip defaults like <style "type=text/css">
gulp.task('images:svg', function (done) {
    'use strict';
    console.log('Processing SVG images from ' + paths.img.source);

    var prefix = ''; // does this ever get overwritten incorrectly due to async piping?

    // Since SVGs are used as-as for all output formats,
    // we can perform this check with gulpif based only
    // on the file path, which is accessible with gulpif.
    var modifyImage = function (file) {
        var filename = getFilenameFromPath(file.path);
        var modificationStatus = modifyImageCheck(filename);
        return modificationStatus;
    }

    gulp.src(paths.img.source + '*.svg')
        .pipe(tap(function (file) {
            prefix = getFileDetailsFromTap(file).prefix;
        }))
        .pipe(debug({title: 'Processing SVG '}))
        .pipe(gulpif(modifyImage, svgmin({
            plugins: [
                // This first pass only runs minifyStyles, to remove CDATA from
                // <style> elements and give later access to inlineStyles.
                { minifyStyles: true },
                { removeDoctype: false },
                { removeXMLProcInst: false },
                { removeComments: false },
                { removeMetadata: false },
                { removeXMLNS: false },
                { removeEditorsNSData: false },
                { cleanupAttrs: false },
                { mergeStyles: false },
                { inlineStyles: false },
                { convertStyleToAttrs: false },
                { cleanupIDs: false },
                { prefixIds: false },
                { removeRasterImages: false },
                { removeUselessDefs: false },
                { cleanupNumericValues: false },
                { cleanupListOfValues: false },
                { convertColors: false },
                { removeUnknownsAndDefaults: false },
                { removeNonInheritableGroupAttrs: false },
                { removeUselessStrokeAndFill: false },
                { removeViewBox: false },
                { cleanupEnableBackground: false },
                { removeHiddenElems: false },
                { removeEmptyText: false },
                { convertShapeToPath: false },
                { convertEllipseToCircle: false },
                { moveElemsAttrsToGroup: false },
                { moveGroupAttrsToElems: false },
                { collapseGroups: false },
                { convertPathData: false },
                { convertTransform: false },
                { removeEmptyAttrs: false },
                { removeEmptyContainers: false },
                { mergePaths: false },
                { removeUnusedNS: false },
                { sortAttrs: false },
                { sortDefsChildren: false },
                { removeTitle: false },
                { removeDesc: false },
                { removeDimensions: false },
                { removeAttrs: false },
                { removeAttributesBySelector: false },
                { removeElementsByAttr: false },
                { addClassesToSVGElement: false },
                { removeStyleElement: false },
                { removeScriptElement: false },
                { addAttributesToSVGElement: false },
                { removeOffCanvasPaths: false },
                { reusePaths: false }
            ]
        })))
        .pipe(gulpif(modifyImage, svgmin(function getOptions() {
            return {
                plugins: [
                    {
                        // We definitely want a viewBox
                        removeViewBox: false
                    },
                    {
                        // With a viewBox, we can remove these
                        removeDimensions: true
                    },
                    {
                        // We can remove data- attributes
                        removeAttrs: {
                            attrs: 'data.*'
                        }
                    },
                    {
                        // Remove unknown elements, but not default values
                        removeUnknownsAndDefaults: {
                            defaultAttrs: false
                        }
                    },
                    {
                        // We want titles for accessibility
                        removeTitle: false
                    },
                    {
                        // We want descriptions for accessibility
                        removeDesc: false
                    },
                    {
                        // Default
                        convertStyleToAttrs: true
                    },
                    {
                        // Default
                        removeUselessStrokeAndFill: true
                    },
                    {
                        inlineStyles: {
                            onlyMatchedOnce: false
                        }
                    },
                    {
                        // Default
                        cleanupAttrs: true
                    },
                    {
                        // Default
                        removeDoctype: true
                    },
                    {
                        // Default
                        removeXMLProcInst: true
                    },
                    {
                        // Default
                        removeComments: true
                    },
                    {
                        // Default
                        removeMetadata: true
                    },
                    {
                        // Default
                        removeUselessDefs: true
                    },
                    {
                        // Default
                        removeXMLNS: false
                    },
                    {
                        // Default
                        removeEditorsNSData: true
                    },
                    {
                        // Default
                        removeEmptyAttrs: true
                    },
                    {
                        // Default
                        removeHiddenElems: true
                    },
                    {
                        // Default
                        removeEmptyText: true
                    },
                    {
                        // Default
                        removeEmptyContainers: true
                    },
                    {
                        // Default
                        cleanupEnableBackground: true
                    },
                    {
                        // Default
                        minifyStyles: true
                    },
                    {
                        // Default
                        convertColors: true
                    },
                    {
                        // Default
                        convertPathData: true
                    },
                    {
                        // Default
                        convertTransform: true
                    },
                    {
                        // Default
                        removeNonInheritableGroupAttrs: true
                    },
                    {
                        // Default
                        removeUselessStrokeAndFill: true
                    },
                    {
                        // Default
                        removeUnusedNS: true
                    },
                    {
                        // Default
                        prefixIds: false
                    },
                    {
                        // Prefix and minify IDs
                        cleanupIDs: {
                            prefix: prefix + '-',
                            minify: true
                        }
                    },
                    {
                        // Default
                        cleanupNumericValues: true
                    },
                    {
                        // Default
                        cleanupListOfValues: true
                    },
                    {
                        // Default
                        moveElemsAttrsToGroup: true
                    },
                    {
                        // Default
                        collapseGroups: true
                    },
                    {
                        // Default
                        removeRasterImages: false
                    },
                    {
                        // Default
                        mergePaths: true
                    },
                    {
                        // Default
                        convertShapeToPath: false
                    },
                    {
                        // Default
                        convertEllipseToCircle: true
                    },
                    {
                        // Default
                        sortAttrs: false
                    },
                    {
                        // Default
                        sortDefsChildren: true
                    },
                    {
                        // Default
                        removeAttributesBySelector: false
                    },
                    {
                        // Default
                        removeElementsByAttr: false
                    },
                    {
                        // Default
                        addClassesToSVGElement: false
                    },
                    {
                        // Default
                        addAttributesToSVGElement: false
                    },
                    {
                        // Default
                        removeOffCanvasPaths: false
                    },
                    {
                        // Default
                        removeStyleElement: false
                    },
                    {
                        // Default
                        removeScriptElement: false
                    },
                    {
                        // Default
                        reusePaths: false
                    }
                ]
            };
        }).on('error', function (e) {
            console.log(e);
        })))
        .pipe(gulp.dest(paths.img.printpdf))
        .pipe(gulp.dest(paths.img.screenpdf))
        .pipe(gulp.dest(paths.img.web))
        .pipe(gulp.dest(paths.img.epub))
        .pipe(gulp.dest(paths.img.app));
    done();
});

// Convert source images for print-pdf
gulp.task('images:printpdf', function (done) {
    'use strict';

    // Options
    var outputFormat = 'print-pdf';
    var colorProfile = 'PSOcoated_v3.icc';
    var colorSpace = 'cmyk';
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Processing ' + outputFormat + ' images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.printpdf})
            .pipe(newer(paths.img.printpdf))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                    .profile('_tools/profiles/' + thisColorProfile)
                    .colorspace(thisColorSpace);
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.printpdf));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:screenpdf', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = 'screen-pdf';
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Processing ' + outputFormat + ' images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {

        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.screenpdf})
            .pipe(newer(paths.img.screenpdf))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                    .profile('_tools/profiles/' + thisColorProfile)
                    .colorspace(thisColorSpace);
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.screenpdf));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:epub', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = 'epub';
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Processing epub images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.epub})
            .pipe(newer(paths.img.epub))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .resize(810, null, '>') // *
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace)
                            .quality(90);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.epub));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:app', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = 'app';
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Processing app images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.app})
            .pipe(newer(paths.img.app))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .resize(810, null, '>') // *
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace)
                            .quality(90);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.app));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:web', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = defaultOutputFormat;
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Processing web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .resize(810, null, '>') // *
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace)
                            .quality(90);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make small images for web use in srcset
gulp.task('images:small', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = defaultOutputFormat;
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Creating small web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .resize(320, null, '>') // *
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace)
                            .quality(90);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: "-320"}))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make medium images for web use in srcset
gulp.task('images:medium', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = defaultOutputFormat;
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Creating medium web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .resize(640, null, '>') // *
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace)
                            .quality(90);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: "-640"}))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make large images for web use in srcset
gulp.task('images:large', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = defaultOutputFormat;
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Creating large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .resize(1024, null, '>') // *
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace)
                            .quality(90);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: "-1024"}))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make extra-large images for web use in srcset
gulp.task('images:xlarge', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = defaultOutputFormat;
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Creating extra-large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .resize(2048, null, '>') // *
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace)
                            .quality(90);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: "-2048"}))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Make full-quality images in RGB
gulp.task('images:max', function (done) {
    'use strict';

    // Set default variables for files,
    // which can be modified during gulp process.
    // Cannot be reset globally because all tasks
    // run asynchronously and values will clash.
    var modifyImage = true;

    // Options
    var outputFormat = defaultOutputFormat;
    var colorProfile = defaultColorProfile;
    var colorSpace = defaultColorSpace;
    var colorProfileGrayscale = defaultColorProfileGrayscale;
    var colorSpaceGrayscale = defaultColorSpaceGrayscale;

    console.log('Creating max-quality web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/' + colorProfile)) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}',
                {ignore: paths.ignore.web})
            .pipe(newer(paths.img.web))

            // --------------------------------------------------------------
            // Same for all bitmap image tasks except `return gmfile` settings
            .pipe(debug({title: 'Creating ' + outputFormat + ' version of '}))
            .pipe(gm(function (gmfile) {

                // Get file details
                var filename = getFilenameFromPath(gmfile.source);

                // Check if we should modify this image
                var modifyImage = modifyImageCheck(filename, outputFormat);

                // Reset defaults (in case previous image in stream
                // set these values to something else)
                var thisColorSpace = colorSpace;
                var thisColorProfile = colorProfile;

                // Override
                var colorSettings = lookupColorSettings(gmfile, colorProfile, colorSpace,
                        colorProfileGrayscale, colorSpaceGrayscale, outputFormat);
                thisColorSpace = colorSettings.colorSpace;
                thisColorProfile = colorSettings.colorProfile;

                if (modifyImage) {
                    return gmfile
                            .profile('_tools/profiles/' + thisColorProfile)
                            .colorspace(thisColorSpace);

                            // * The '>' option specifies that the image should not be made larger
                            //   if the original's width is less than the target width.
                            //   See http://www.graphicsmagick.org/GraphicsMagick.html#details-geometry
                } else {
                    return gmfile
                    .define('jpeg:preserve-settings')
                    .compress('None')
                    .quality(100);
                }
                // --------------------------------------------------------------

            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: "-max"}))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/' + colorProfile + ' not found. Exiting.');
        return;
    }
    done();
});

// Minify JS files to make them smaller,
// using the drop_console option to remove console logging
gulp.task('js', function (done) {
    'use strict';

    if (paths.js.src.length > 0) {
        console.log('Minifying Javascript');
        gulp.src(paths.js.src)
            .pipe(debug({title: 'Minifying '}))
            .pipe(uglify({compress: {drop_console: true}}).on('error', function (e) {
                console.log(e);
            }))
            .pipe(rename({suffix: '.min'}))
            .pipe(gulp.dest(paths.js.dest));
        done();
    } else {
        console.log('No scripts in source list to minify.');
        done();
    }
});

// Process MathJax in output HTML

// Settings for mathjax-node-page. leave empty for defaults.
// https://www.npmjs.com/package/gulp-mathjax-page
var mjpageOptions = {
    mjpageConfig: {
        format: ["TeX"], // determines type of pre-processors to run
        output: 'svg', // global override for output option; 'svg', 'html' or 'mml'
        tex: {}, // configuration options for tex pre-processor, cf. lib/tex.js
        ascii: {}, // configuration options for ascii pre-processor, cf. lib/ascii.js
        singleDollars: false, // allow single-dollar delimiter for inline TeX
        fragment: false, // return body.innerHTML instead of full document
        cssInline: true,  // determines whether inline css should be added
        jsdom: {}, // jsdom-related options
        displayMessages: false, // determines whether Message.Set() calls are logged
        displayErrors: true, // determines whether error messages are shown on the console
        undefinedCharError: false, // determines whether unknown characters are saved in the error array
        extensions: '', // a convenience option to add MathJax extensions
        fontURL: '', // for webfont urls in the CSS for HTML output
        MathJax: {
            messageStyle: "none",
            SVG: {
                font: "Gyre-Pagella",
                matchFontHeight: false,
                blacker: 0,
                styles: {
                    ".MathJax [style*=border-top-width]": {
                        "border-top-width": "0.5pt ! important"
                    }
                }
            }
        } // options MathJax configuration, see https://docs.mathjax.org
    },
    mjnodeConfig: {
        ex: 6, // ex-size in pixels (ex is an x-height unit)
        width: 100, // width of math container (in ex) for linebreaking and tags
        useFontCache: true, // use <defs> and <use> in svg output?
        useGlobalCache: false, // use common <defs> for all equations?
        // state: mjstate, // track global state
        linebreaks: true, // do linebreaking?
        equationNumbers: "none", // or "AMS" or "all"
        math: "", // the math to typeset
        html: false, // generate HTML output?
        css: false, // generate CSS for HTML output?
        mml: false, // generate mml output?
        svg: true, // generate svg output?
        speakText: false, // add spoken annotations to output?
        timeout: 10 * 1000 // 10 second timeout before restarting MathJax
    }
};

// Process MathJax in HTML files
gulp.task('mathjax', function (done) {
    'use strict';

    console.log('Processing MathJax in ' + paths.text.src);
    gulp.src(paths.text.src)
        .pipe(mathjax(mjpageOptions))
        .pipe(debug({title: 'Processing MathJax in '}))
        .pipe(gulp.dest(paths.text.dest));
    done();
});

// Process MathJax in all HTML files
gulp.task('mathjax:all', function (done) {
    'use strict';
    var k;
    var mathJaxFilePaths = loadMetadata().paths;
    for (k = 0; k < mathJaxFilePaths.length; k += 1) {
        console.log('Processing MathJax in ' + mathJaxFilePaths[k]);
        gulp.src(mathJaxFilePaths[k] + '*.html')
            .pipe(mathjax(mjpageOptions))
            .pipe(debug({title: 'Processing MathJax in '}))
            .pipe(gulp.dest(mathJaxFilePaths[k]));
        done();
    }
});

// Convert all file names in internal links from .html to .xhtml.
// This is required for epub output to avoid EPUBCheck warnings.
gulp.task('epub:xhtmlLinks', function (done) {
    'use strict';

    gulp.src([paths.epub.src, '_site/epub/package.opf', '_site/epub/toc.ncx'], {base: './'})
        .pipe(cheerio({
            run: function ($) {
                var target, asciiTarget, newTarget;
                $('[href*=".html"], [src*=".html"], [id], [href^="#"]').each(function () {
                    if ($(this).attr('href')) {
                        target = $(this).attr('href');
                    } else if ($(this).attr('src')) {
                        target = $(this).attr('src');
                    } else if  ($(this).attr('id')) {
                        target = $(this).attr('id')
                    } else {
                        return;
                    }

                    // remove all non-ascii characters using iconv-lite
                    // by converting the target from utf-8 to ascii.
                    var iconvLiteBuffer = iconv.encode(target, 'utf-8');
                    var asciiTarget = iconv.decode(iconvLiteBuffer, 'ascii');
                    // Note that this doesn't remove illegal characters,
                    // which must then be replaced.
                    // (See https://github.com/ashtuchkin/iconv-lite/issues/81)
                    var asciiTarget = asciiTarget.replace(/[�?]/g, '');

                    if (!asciiTarget.includes('http')) {
                        newTarget = asciiTarget.replace('.html', '.xhtml');
                        if ($(this).attr('href')) {
                            $(this).attr('href', newTarget);
                        } else if ($(this).attr('src')) {
                            $(this).attr('src', newTarget);
                        } else if ($(this).attr('id')) {
                            $(this).attr('id', newTarget);
                        }
                    }
                });
            },
            parserOptions: {
                xmlMode: true
            }
        }))
        .pipe(debug({title: 'Converting internal links to .xhtml in '}))
        .pipe(gulp.dest('./'));
    done();
});

// Rename epub .html files to .xhtml.
// Creates a copy of the file that must then be cleaned out
// with the subsequent gulp task `epub:cleanHtmlFiles``
gulp.task('epub:xhtmlFiles', function (done) {
    'use strict';

    console.log('Renaming *.html to *.xhtml in ' + paths.epub.src);
    gulp.src(paths.epub.src)
        .pipe(debug({title: 'Renaming '}))
        .pipe(rename({
            extname: '.xhtml'
        }))
        .pipe(gulp.dest(paths.epub.dest));
    done();
});

// Clean out renamed .html files
gulp.task('epub:cleanHtmlFiles', function () {
    'use strict';
    console.log('Removing old *.html files in ' + paths.epub.src);
    return del(paths.epub.src);
});

// Validate yaml files
gulp.task('yaml', function (done) {
    'use strict';

    console.log('Checking YAML files...');

    gulp.src(paths.yaml.src)
        .pipe(tap(function (file) {
            try {
                yaml.safeLoad(fs.readFileSync(file.path, 'utf8'));
                console.log(file.basename + ' ✓');
            } catch (e) {
                console.log(''); // empty line space
                console.log('\x1b[35m%s\x1b[0m', 'YAML error in ' + file.path + ':');
                console.log('\x1b[36m%s\x1b[0m', e.message);
                console.log(''); // empty line space
            }
        }));
    done();
});

// Turn HTML comments for book indexes into anchor tags.
// This is a pre-processing alternative to assets/js/index-targets.js,
// which dynamically adds index targets in web clients.
// It duplicates much of what index-targets.js does. So, if you
// update it, you may need to update index-targets.js as well.
gulp.task('renderIndexCommentsAsTargets', function (done) {
    'use strict';
    gulp.src(allTextPaths(store), {base: './'})
        .pipe(cheerio({
            run: function ($) {

                // Create an empty array to store entries.
                var entries = [];

                $('*').contents()
                    // Return only text nodes...
                    .filter(function () {
                        return this.nodeType === 8
                    })
                    // .. that start with `index:`
                    .filter(function () {
                        return (/^\s*index:/).test(this.data)
                    })
                    .each(function (index, comment) {

                        // Is this comment between elements ('block')
                        // or inline (e.g. inside a paragraph)?
                        var startsWithLinebreak = /^\n/;
                        var position;
                        if (startsWithLinebreak.test(comment.prev.data)
                                && startsWithLinebreak.test(comment.next.data)) {
                            position = 'block';
                        } else {
                            position = 'inline';
                        }

                        // Split the lines into an array.
                        var commentText = this.data;
                        var commentLines = commentText.split('\n');

                        // Process each line, i.e. each index target in the comment.
                        commentLines.forEach(function (line) {

                            // Remove the opening 'index:' prefix.
                            var indexKeywordRegex = /^\s*index:/;
                            if (indexKeywordRegex.test(line)) {
                                line = line.replace(indexKeywordRegex, '');
                            }

                            // Strip white space at start and end of line.
                            line = line.trim();

                            // Exit if the stripped line is now empty.
                            // We only want to process actual book-index terms.
                            if (line === '') {
                                return;
                            }

                            // Split the line into its entry components.
                            // It might be a nested entry, where each level
                            // of nesting appears after double backslashes.
                            // e.g. software \\ book-production
                            var rawEntriesByLevel = line.split('\\');

                            // Trim whitespace from each entry
                            // https://stackoverflow.com/a/41183617/1781075
                            // and remove any leading or trailing hyphens.
                            var entriesByLevel = rawEntriesByLevel.map(function (str) {
                                return str.trim().replace(/^-+|-+$/, '');
                            });

                            // Check for starting or ending hyphens.
                            // If one exists, flag the target as `from` or `to`,
                            // starting or ending a reference range. Then strip the hyphen.
                            // Note, JS's `startsWith` and `endsWith` are not supported
                            // in PrinceXML, so we didn't use those in case using this in Prince.
                            var rangeClass = 'index-target-specific';

                            if (line.substring(0, 1) === '-') {
                                rangeClass = 'index-target-to';
                                line = line.substring(1);
                            } else if (line.substring(line.length - 1) === '-') {
                                rangeClass = 'index-target-from';
                                line = line.substring(0, line.length - 1);
                            }

                            // Slugify the target text to use in an ID
                            // and to check for duplicate instances later.
                            var entrySlug = ebSlugify(line);

                            // Add the slug to the array of entries,
                            // where will we count occurrences of this entry.
                            entries.push(entrySlug);

                            // Create an object that counts occurrences
                            // of this entry on the page so far.
                            var entryOccurrences = entries.reduce(function (allEntries, entry) {
                                if (entry in allEntries) {
                                    allEntries[entry] += 1;
                                } else {
                                    allEntries[entry] = 1;
                                }
                                return allEntries;
                            }, {});

                            // Get the number of occurrences of this entry so far.
                            var occurrencesSoFar = entryOccurrences[entrySlug];

                            // Use that to add a unique index-ID suffix to the entry slug.
                            var id = entrySlug + '--iid-' + occurrencesSoFar;

                            // Create a target for each line.
                            // Note: we can't use one target element for several index entries,
                            // because one element can't have multiple IDs.
                            // And we don't try to link index entries to IDs of existing elements
                            // because those elements' IDs could change, and sometimes
                            // we want our target at a specific point inline in a textnode.

                            // Create an anchor tag for each line.
                            // Note: this tag contains a zero-width space, so that it
                            // actually appears in Prince, which doesn't render empty elements.
                            var newAnchorElement = $('<a>​</a>')
                                .addClass('index-target')
                                .addClass(rangeClass)
                                .attr('data-target-type', position)
                                .attr('id', id)
                                .attr('data-index-markup', line)
                                .attr('data-index-entry', entriesByLevel.slice(-1).pop())
                                .attr('style', 'position: absolute');

                            newAnchorElement.insertAfter(comment);
                        });
                    });

                // If the comment was between blocks, it has `data-target-type=block`.
                // So the anchor targets need to move inside the following block.
                // Since this noob can't seem to get the element after a comment
                // in Cheerio above, we must do a second pass here, after creating
                // anchor targets above, to move them into position. To do this:
                // we get the next element that is not an .index-target
                // then prepend the link to it.

                $('[data-target-type=block]').each(function (i, link) {

                    var link = $(link); // wrap it for cheerio
                    var indexedElement = $(link).nextAll(':not(.index-target)').first();
                    indexedElement.prepend(link);
                });

                // Finally, flag that we're done.
                $('body').attr('data-index-targets', 'loaded');
            },
            parserOptions: {
                // XML mode necessary for epub output
                xmlMode: true
            }
        }))
        .pipe(debug({title: 'Rendering book-indexing HTML comments as elements in '}))
        .pipe(gulp.dest('./'));
    done();
});

// Check HTML pages for reference indexes. If we find any,
// look up each list item in the book-index-*.js, and add a link.
// This is a pre-processing alternative to assets/js/index-lists.js,
// which dynamically adds links to reference indexes client-side.
// This pre-processing alternative is necessary for offline formats.
// It duplicates much of what index-lists.js does. So, if you
// update it, you may need to update index-lists.js as well.
gulp.task('renderIndexListReferences', function (done) {
    'use strict';
    gulp.src(paths.text.src, {base: './'})
        .pipe(cheerio({
            run: function ($) {

                // Add a link to an entry in a reference index
                function ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry) {
                    'use strict';

                    var link = $('<a>​</a>')
                        .attr('href', entry.filename + '#' + entry.id)
                        .text(pageReferenceSequenceNumber)

                    // Add a class to flag whether this link starts
                    // or ends a reference range.
                    if (entry.range === 'from' || entry.range === 'to') {
                        link.addClass('index-range-' + entry.range);
                    } else {
                        link.addClass('index-range-none');
                    }

                    // If the listItem has child lists, insert the link
                    // before the first child list. Otherwise, append the link.
                    if ($(listItem).find('ul').length > 0) {
                        link.insertBefore($(listItem).find('ul'));
                    } else {
                        link.appendTo(listItem);
                    }
                }

                // Add a link to a specific reference-index entry
                function ebIndexFindLinks(listItem, ebIndexTargets) {
                    'use strict';

                    listItem = $(listItem);
                    var nestingLevel = listItem.parentsUntil('.reference-index').length / 2;

                    // We're already looping through all `li`, even descendants.
                    // For each one, contruct its tree from its parent nodes.
                    // When we look up this entry in the db, we'll compare
                    // the constructed tree with the real one in the index 'database'.
                    var listItemTree = [];

                    // If a list item has a parent list item, add its
                    // text value to the beginning of the tree array.
                    // Iterate up the tree to each possible parent.

                    // If the list item has a first child that contains text
                    // use that text; otherwise use the entire list item's text.

                    // Get the text value of an li without its li children
                    function getListItemText(li) {

                        var listItemClone = li.clone();
                        listItemClone.find('li').remove();

                        // If page refs have already been added to the li,
                        // we don't want those in the text. They appear after
                        // a line break, so we regex everything from that \n.
                        var text = listItemClone.text().trim().replace(/\n.*/, '');
                        return text;
                    }

                    listItemTree.push(getListItemText(listItem));

                    if (nestingLevel > 0) {

                        function buildTree(listItem) {
                            if (listItem.parent()
                                    && listItem.parent().closest('li').contents()[0]) {
                                listItemTree.unshift(getListItemText(listItem.parent().closest('li')));
                                buildTree(listItem.parent().closest('li'));
                            }
                        }
                        buildTree(listItem);
                    }

                    // Reconstruct the reference's text value from the tree
                    // and save its slug.
                    var listItemSlug = ebSlugify(listItemTree.join(' \\ '));

                    // Get the book title and translation language (if any)
                    // for the HTML page we're processing.
                    var currentBookTitle = $('body').attr('data-title');
                    var currentTranslation = $('body').attr('data-translation');

                    // Look through the index 'database' of targets
                    // Each child in the ebIndexTargets array represents
                    // the index anchor targets on one HTML page.
                    ebIndexTargets.forEach(function (pageEntries) {

                        // Reset variables
                        var titleMatches = false;
                        var languageMatches = false;
                        var bookIsTranslation = false;
                        var entryHasTranslationLanguage = false;

                        // First, check if the entries for this page
                        // of entries are for files in the same book.
                        // We just check against the first entry for the page.
                        if (currentBookTitle === pageEntries[0].bookTitle) {
                            titleMatches = true;
                        }

                        // Check if this is the same language.
                        // If the book we're in has a translation language...
                        if (currentTranslation) {
                            bookIsTranslation = true;

                            // ... and if the entry also has one
                            if (pageEntries[0].translationLanguage) {
                                entryHasTranslationLanguage = true;

                                // ... and if they're the same, the language matches.
                                if (bookIsTranslation && entryHasTranslationLanguage) {
                                    if (currentTranslation === pageEntries[0].translationLanguage) {
                                        languageMatches = true;
                                    }
                                }
                            }
                        } else {

                            // Otherwise, if there was no translation language
                            // for the book above, and there IS a language
                            // noted for this entry, then there's no match.
                            if (pageEntries[0].translationLanguage) {
                                languageMatches = false;
                            } else {

                                // Finally, if there was neither a currentTranslation
                                // above, nor a translation language for this entry,
                                // then it must be a match, because no languages defined
                                // means both are the default language for this project.
                                languageMatches = true;
                            }
                        }

                        if (titleMatches && languageMatches) {

                            // Find this entry's page numbers
                            var pageReferenceSequenceNumber = 1;
                            var rangeOpen = false;
                            pageEntries.forEach(function (entry) {


                                if (entry.entrySlug === listItemSlug) {

                                    // If a 'from' link has started a reference range,
                                    // skip links till the next 'to' link that closes the range.
                                    if (entry.range === 'from') {
                                        rangeOpen = true;
                                        ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry);
                                        pageReferenceSequenceNumber += 1;
                                    }
                                    if (rangeOpen) {
                                        if (entry.range === 'to') {
                                            ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry);
                                            pageReferenceSequenceNumber += 1;
                                            rangeOpen = false;
                                        }
                                    } else {
                                        ebIndexAddLink(listItem, pageReferenceSequenceNumber, entry);
                                        pageReferenceSequenceNumber += 1;
                                    }
                                }
                            });
                        }
                    });
                }

                // Get all the indexes on the page, and start processing them.
                function ebIndexPopulate(ebIndexTargets) {
                    'use strict';

                    // Don't do this if the list links are already loaded.
                    if ($('body').attr('data-index-list') === 'loaded') {
                        return;
                    }

                    var listItems = $('.reference-index li');

                    if (listItems.length > 0) {
                        listItems.each(function () {
                            ebIndexFindLinks(this, ebIndexTargets);
                        });
                    }
                }

                var indexLists = $('.reference-index');
                if (indexLists.length > 0) {
                    var indexListsProcessed = 0;
                    indexLists.each(function () {

                        // Process for epub output by default
                        if (output === 'printpdf') {
                            ebIndexPopulate(printpdfIndexTargets);
                        } else if (output === 'screenpdf') {
                            ebIndexPopulate(screenpdfIndexTargets);
                        } else if (output === 'app') {
                            ebIndexPopulate(appIndexTargets);
                        } else {
                            ebIndexPopulate(epubIndexTargets);
                        }

                        // Flag when we're done
                        indexListsProcessed += 1;
                        if (indexListsProcessed === indexLists.length
                                || indexLists.length === 1) {
                            $('body').attr('data-index-list', 'loaded');
                        }
                    })
                }
            },
            parserOptions: {
                // XML mode necessary for epub output
                xmlMode: true
            }
        }))
        .pipe(debug({title: 'Rendering book-index links in '}))
        .pipe(gulp.dest('./'));
    done();
});

// When running `gulp`, do the image tasks by default.
gulp.task('default', gulp.series(
    'images:svg',
    'images:printpdf',
    'images:screenpdf',
    'images:epub',
    'images:app',
    'images:web',
    'images:small',
    'images:medium',
    'images:large',
    'images:xlarge',
    'images:max'
));
