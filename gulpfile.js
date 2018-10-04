// 必要プラグインの読み込み (var gulp = ~ でも可)
const gulp    = require("gulp");
const sass    = require("gulp-sass");
const plumber = require('gulp-plumber');
const notify  = require('gulp-notify');
const cached  = require('gulp-cached');
const postcss = require('gulp-postcss');
const csso    = require('gulp-csso');

gulp.task('sass', () => {
  return gulp.src('./src/**/*.scss')
    .pipe(sass().on('error', sass.logError))
    .pipe(cached())
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
	.pipe(postcss([
		require('autoprefixer')({grid: true}),
		require('pixrem')({rootValue: 10}),
		require('css-mqpacker')
	]))
	.pipe(csso())
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.scss', ['sass']);
});

gulp.task('default', ['watch']);
