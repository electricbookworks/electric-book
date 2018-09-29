var gulp = require('gulp'),
    responsive = require('gulp-responsive-images'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    watch = require('gulp-watch'),
    newer = require('gulp-newer'),
    gm = require('gulp-gm'),
    svgmin = require('gulp-svgmin'),
    args = require('yargs').argv,
    fileExists = require('file-exists');

// get the book we're processing
var book = 'book';
if (args.book && args.book.trim != '') {
    book = args.book;
}

// reminder
if (book == 'book') {
    console.log('If processing images for a book that\'s not in the /book directory, use the --book argument, e.g. gulp --book potatoes');
    console.log('To process images in _items, use gulp --book _items');
}

// get the language we're processing
var language = '';
if (args.language && args.language.trim != '') {
    language = '/' + args.language;
}

// reminder
if (language == '') {
    console.log('If processing a translation\'s images, use the --language argument, e.g. gulp --language fr');
}

// set up paths for later
// add paths to any JS files to minify to the src array, e.g.
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
    js: {
        src: [],
        dest: 'assets/js/'
    }
};

// Shall we lint Javascript when watching with `gulp watch`?
// If true, the jslint task will throw errors when your JS isn't perfect.
// If false, `gulp watch` will not run the jslint task.
// Lint settings in eslint.json, in the same folder as this gulpfile.
var lintJS = true;

// set filetypes to convert, comma separated, no spaces;
// by default we don't convert svg which throws an error
var filetypes = 'jpg,jpeg,gif,png';


// Minify and clean SVGs and copy to destinations
// For EpubCheck-safe SVGs, we remove data- attributes
// and don't strip defaults like <style "type=text/css">
gulp.task('images:svg', function (done) {
    'use strict';
    console.log('Processing SVG images from ' + paths.img.source);
    gulp.src(paths.img.source + '*.svg')
    .pipe(svgmin({
       plugins: [{
            removeAttrs: { attrs: 'data.*' }
        }, {
            removeUnknownsAndDefaults: {
                defaultAttrs: false
            }
        }]
    }).on('error', function(e){
            console.log(e);
         }))
    .pipe(gulp.dest(paths.img.printpdf))
    .pipe(gulp.dest(paths.img.screenpdf))
    .pipe(gulp.dest(paths.img.web))
    .pipe(gulp.dest(paths.img.epub))
    .pipe(gulp.dest(paths.img.app));
    done();
});

// Take the source images and convert them for print-pdf
gulp.task('images:printpdf', function (done) {
    'use strict';
    console.log('Processing print-PDF images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/PSOcoated_v3.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
        .pipe(newer(paths.img.printpdf))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('_tools/profiles/PSOcoated_v3.icc').colorspace('cmyk');
        }).on('error', function(e){
            console.log(e);
            }))
        .pipe(gulp.dest(paths.img.printpdf));
    } else {
        console.log('Colour profile _tools/profiles/PSOcoated_v3.icc not found. Exiting.');
        return;
    }
    done();
});

// Take the source images and optimise and resize them for
// screen-pdf, web, epub, and app
gulp.task('images:optimise', function (done) {
    'use strict';
    console.log('Processing screen-PDF, web, epub and app images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(responsive({
            '*': [{
                width: 810,
                quality: 90,
                upscale: false
            }]
        }).on('error', function(e){
            console.log(e);
            }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }).on('error', function(e){
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

// Make small size images for web use in srcset in _includes/figure
gulp.task('images:small', function (done) {
    'use strict';
    console.log('Creating small web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(responsive({
                '*': [{
                    width: 320,
                    quality: 90,
                    upscale: false,
                    suffix: '-320'
                }]
            }).on('error', function(e){
                console.log(e);
                }))
            .pipe(gm(function(gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function(e){
                console.log(e);
                }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
    done();
});

// Make medium size images for web use in srcset in _includes/figure
gulp.task('images:medium', function (done) {
    'use strict';
    console.log('Creating medium web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(responsive({
                '*': [{
                    width: 640,
                    quality: 90,
                    upscale: false,
                    suffix: '-640'
                }]
            }).on('error', function(e){
                console.log(e);
                }))
            .pipe(gm(function(gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function(e){
                console.log(e);
                }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
    done();
});

// Make large size images for web use in srcset in _includes/figure
gulp.task('images:large', function (done) {
    'use strict';
    console.log('Creating large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(responsive({
                '*': [{
                    width: 1024,
                    quality: 90,
                    upscale: false,
                    suffix: '-1024'
                    }]
                }).on('error', function(e){
                    console.log(e);
                    }))
            .pipe(gm(function(gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function(e){
                console.log(e);
                }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    }
    done();
});

// Make extra large images for web use in srcset
gulp.task('images:xlarge', function (done) {
    'use strict';
    console.log('Creating extra-large web images from ' + paths.img.source);
    if (fileExists.sync('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc')) {
        gulp.src(paths.img.source + '*.{' + filetypes + '}')
            .pipe(newer(paths.img.web))
            .pipe(responsive({
                '*': [{
                    width: 2048,
                    quality: 90,
                    upscale: false,
                    suffix: '-2048'
                    }]
                }).on('error', function(e){
                    console.log(e);
                    }))
            .pipe(gm(function(gmfile) {
                return gmfile.profile('_tools/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
            }).on('error', function(e){
                console.log(e);
                }))
            .pipe(gulp.dest(paths.img.web));
    } else {
        console.log('Colour profile _tools/profiles/sRGB_v4_ICC_preference_displayclass.icc not found. Exiting.');
        return;
    };
    done();
});

// minify JS files to make them smaller
// using the drop_console option to remove console logging
gulp.task('js', function(done) {
    if (paths.js.src.length > 0) {
        console.log('Minifying Javascript');
        gulp.src(paths.js.src)
        .pipe(uglify({ compress: { drop_console: true } }).on('error', function(e){
            console.log(e);
            }))
        .pipe(rename({ suffix:'.min' }))
        .pipe(gulp.dest(paths.js.dest));
        done();
    } else {
        console.log('No scripts in source list to minify.')
        done();
    }
});

// lint the JS files: check for errors and inconsistencies
gulp.task('jslint', function(done) {
    if (paths.js.src.length > 0) {
        console.log('Linting Javascript');
        gulp.src(paths.js.src)
        .pipe(eslint({
            configFile: 'eslint.json',
            fix: true
        }))
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
        done();
    } else {
        console.log('No scripts in source list to lint.');
        done();
    }
});

// watch the JS files for changes, and run jslint and js tasks when they do

gulp.task('watch', function(done) {
    if (paths.js.src.length > 0) {
        console.log('Watching for Javascript changes');
        gulp.watch(paths.js.src, gulp.parallel('js'));
        if (fileExists.sync('eslint.json') && lintJS == true) {
            gulp.watch(paths.js.src, gulp.parallel('jslint'));
        }
    } else {
        console.log('No scripts in source list to watch.');
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
                                )
);
