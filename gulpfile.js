var gulp = require('gulp'),
    newer = require('gulp-newer'),
    imagemin = require('gulp-imagemin');

var paths = {
	img: {
		pdf: 'book/images/print-pdf/',
		web: 'book/images/web/'
	}
};

gulp.task('default', function() {
    gulp.src(paths.img.pdf + '*')
    .pipe(newer(paths.img.web))
    .pipe(imagemin([
        imagemin.gifsicle({interlaced: true}),
        imagemin.jpegtran({progressive: true}),
        imagemin.optipng({optimizationLevel: 5}),
        imagemin.svgo({plugins: [{removeViewBox: true}]})
    ]))
    .pipe(gulp.dest(paths.img.web))
});
