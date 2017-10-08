'use strict';

var gulp = require('gulp'),
    responsive = require('gulp-responsive-images'),
    uglify = require('gulp-uglify'),
    rename = require('gulp-rename'),
    eslint = require('gulp-eslint'),
    watch = require('gulp-watch'),
    newer = require('gulp-newer'),
    gm = require('gulp-gm'),
    args = require('yargs').argv;

// get the book we're processing
var book = 'book';
if (args.book) {
    var book = args.book;
};

// get the language we're processing
var language = '';
if (args.language) {
    var language = '/' + args.language;
};

// set up paths for later
var paths = {
    img: {
        source: book + language + '/images/_source/',
        printpdf: book + language + '/images/print-pdf/',
        web: book + language + '/images/web/',
        screenpdf: book + language + '/images/screen-pdf/',
        epub: book + language + '/images/epub/',
    },
    js: {
        src: [],
        dest: 'assets/js/'
    }
};

console.log(paths.img.source);

// Take the source images and convert them for print-pdf
gulp.task('images:printpdf', function () {
    gulp.src(paths.img.source + '*')
    .pipe(newer(paths.img.printpdf))
    .pipe(gm(function(gmfile) {
        return gmfile.profile('assets/profiles/PSOcoated_v3.icc').colorspace('cmyk');
    }))
    .pipe(gulp.dest(paths.img.printpdf));
});

// Take the source images and optimise and resize them for web and screen-pdf
gulp.task('images:optimise', function () {
    gulp.src(paths.img.source + '*')
        .pipe(newer(paths.img.web))
        .pipe(responsive({
        '*': [{
            width: 810,
            quality: 90,
            upscale: false,
        }]
    }))
    .pipe(gm(function(gmfile) {
        return gmfile.profile('assets/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
    }))
    .pipe(gulp.dest(paths.img.screenpdf))
    .pipe(gulp.dest(paths.img.web));
});

// Take the print images and optimise and resize them for epub
gulp.task('images:epub', function () {
    gulp.src(paths.img.source + '*')
        .pipe(newer(paths.img.epub))
        .pipe(responsive({
        '*': [{
            width: 810,
            quality: 90,
            upscale: false,
        }]
    }))
    .pipe(gm(function(gmfile) {
        return gmfile.profile('assets/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
    }))
    .pipe(gulp.dest(paths.img.epub))
});

// Make small size images for use in srcset in _includes/figure
gulp.task('images:small', function () {
    gulp.src(paths.img.source + '*')
        .pipe(newer(paths.img.web))
        .pipe(responsive({
            '*': [{
                width: 320,
                quality: 90,
                upscale: false,
                suffix: '-320',
            }]
        }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('assets/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.web));
});

// Make medium size images for use in srcset in _includes/figure
gulp.task('images:medium', function () {
    gulp.src(paths.img.source + '*')
        .pipe(newer(paths.img.web))
        .pipe(responsive({
            '*': [{
                width: 640,
                quality: 90,
                upscale: false,
                suffix: '-640',
            }]
        }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('assets/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.web));
});

// Make large size images for use in srcset in _includes/figure
gulp.task('images:large', function () {
    gulp.src(paths.img.source + '*')
        .pipe(newer(paths.img.web))
        .pipe(responsive({
            '*': [{
                width: 1024,
                quality: 90,
                upscale: false,
                suffix: '-1024',
                }]
            }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('assets/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.web));
});

// Make extra large images for use in srcset
gulp.task('images:xlarge', function () {
    gulp.src(paths.img.source + '*')
        .pipe(newer(paths.img.web))
        .pipe(responsive({
            '*': [{
                width: 2048,
                quality: 90,
                upscale: false,
                suffix: '-2048',
                }]
            }))
        .pipe(gm(function(gmfile) {
            return gmfile.profile('assets/profiles/sRGB_v4_ICC_preference_displayclass.icc').colorspace('rgb');
        }))
        .pipe(gulp.dest(paths.img.web));
});

// minify JS files to make them smaller
gulp.task('js', function() {
    gulp.src(paths.js.src)
    .pipe(uglify())
    .pipe(rename({ suffix:'.min' }))
    .pipe(gulp.dest(paths.js.dest));
});

// lint the JS files: check for errors and inconsistencies
gulp.task('jslint', function() {
    gulp.src(paths.js.src)
    .pipe(eslint({
        configFile: 'eslint.json',
        fix: true
    }))
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

// watch the JS files for changes, run jslin and js tasks when they do
gulp.task('watch', function() {
    gulp.watch(paths.js.src, ['jslint', 'js']);
});

// when running `gulp`, do the image tasks
gulp.task('default', ['images:printpdf', 'images:optimise', 'images:epub', 'images:small', 'images:medium', 'images:large', 'images:xlarge']);
