// This gulpfile processes:
// - images, optimising them for output formats
// - Javascript, optionally, minifying scripts for performance
// - HTML, rendering MathJax as MathML.
// It takes two arguments: --book and --language, e.g.:
// gulp --book samples --language fr

// Get Node modules
var gulp = require('gulp'),
    responsive = require('gulp-responsive-images'),
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
    debug = require('gulp-debug');

// Get arrays of possible book and language paths
var metadata = yaml.load(fs.readFileSync('_data/meta.yml', 'utf8'));
var works = metadata.works;
function loadMetadata() {
    'use strict';
    var paths = [];
    var filePaths = [];
    var books = [];
    var languages = [];
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
    return {
        books: books,
        languages: languages,
        paths: paths,
        filePaths: filePaths
    };
}
loadMetadata();

// Get the book we're processing
var book = 'book';
if (args.book && args.book.trim !== '') {
    book = args.book;
}

// Reminder on usage
if (book === 'book') {
    console.log('If processing images for a book that\'s not in the /book directory, use the --book argument, e.g. gulp --book potatoes');
    console.log('To process images in _items, use gulp --book _items');
}

// Get the language we're processing
var language = '';
if (args.language && args.language.trim !== '') {
    language = '/' + args.language;
}

// Reminder on usage
if (language === '') {
    console.log('If processing a translation\'s images, use the --language argument, e.g. gulp --language fr');
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
    js: {
        src: [],
        dest: 'assets/js/'
    }
};

// Set filetypes to convert, comma separated, no spaces
var filetypes = 'jpg,jpeg,gif,png';

// Minify and clean SVGs and copy to destinations.
// For EpubCheck-safe SVGs, we remove data- attributes
// and don't strip defaults like <style "type=text/css">
gulp.task('images:svg', function (done) {
    'use strict';
    console.log('Processing SVG images from ' + paths.img.source);
    gulp.src(paths.img.source + '*.svg')
        .pipe(debug({title: 'Processing SVG '}))
        .pipe(svgmin({
            plugins: [{
                removeAttrs: {attrs: 'data.*'}
            }, {
                removeUnknownsAndDefaults: {
                    defaultAttrs: false
                }
            }]
        }).on('error', function (e) {
            console.log(e);
        }))
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
    console.log('Processing print-PDF images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/PSOcoated_v3.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.printpdf))
            .pipe(debug({title: 'Creating print-PDF version of '}))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/PSOcoated_v3.icc').colorspace('cmyk');
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.printpdf));
    } else {
        console.log('Colour profile _tools/profiles/PSOcoated_v3.icc not found. Exiting.');
        return;
    }
    done();
});

// Convert and optimise source images
// for screen-pdf, web, epub, and app
gulp.task('images:optimise', function (done) {
    'use strict';
    console.log('Processing screen-PDF, web, epub and app images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Optimising '}))
            .pipe(responsive({
                '*': [{
                    width: 810,
                    quality: 90,
                    upscale: false
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.screenpdf))
            .pipe(gulp.dest(paths.img.web))
            .pipe(gulp.dest(paths.img.epub))
            .pipe(gulp.dest(paths.img.app));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
    done();
});

// Make small images for web use in srcset
gulp.task('images:small', function (done) {
    'use strict';
    console.log('Creating small web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating small '}))
            .pipe(responsive({
                '*': [{
                    width: 320,
                    quality: 90,
                    upscale: false,
                    suffix: '-320'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
    done();
});

// Make medium images for web use in srcset
gulp.task('images:medium', function (done) {
    'use strict';
    console.log('Creating medium web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating medium '}))
            .pipe(responsive({
                '*': [{
                    width: 640,
                    quality: 90,
                    upscale: false,
                    suffix: '-640'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
    done();
});

// Make large images for web use in srcset
gulp.task('images:large', function (done) {
    'use strict';
    console.log('Creating large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating large '}))
            .pipe(responsive({
                '*': [{
                    width: 1024,
                    quality: 90,
                    upscale: false,
                    suffix: '-1024'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
    done();
});

// Make extra-large images for web use in srcset
gulp.task('images:xlarge', function (done) {
    'use strict';
    console.log('Creating extra-large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(debug({title: 'Creating extra-large '}))
            .pipe(responsive({
                '*': [{
                    width: 2048,
                    quality: 90,
                    upscale: false,
                    suffix: '-2048'
                }]
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gm(function (gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function (e) {
                console.log(e);
            }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
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

// when running `gulp`, do the image tasks
gulp.task('default', gulp.series(
    'images:svg',
    'images:printpdf',
    'images:optimise',
    'images:small',
    'images:medium',
    'images:large',
    'images:xlarge'
));
