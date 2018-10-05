// 必要プラグインの読み込み (var gulp = ~ でも可)
const gulp    = require("gulp");
const sass    = require("gulp-sass");
const plumber = require('gulp-plumber');
const notify  = require('gulp-notify');
const cached  = require('gulp-cached');
const postcss = require('gulp-postcss');
const csso    = require('gulp-csso');
const ejs     = require('gulp-ejs');
const data    = require('gulp-data');

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

gulp.task('ejs', () => {
	return gulp.src(['./src/**/*.ejs', '!src/ejs/**/_*.ejs', '!src/_partial/*.ejs'])
    .pipe(data(function(file) {
      return { 'filename': file.path }
    }))
		.pipe(ejs(
		  {
        "siteData": {
          "name": "サンプルサイト",
          "description": "メタディスクリプションになります。サンプルサイトになります。",
          "url": "https://www.example.com"
        },
        "src": {
          "srcDir": "src\\",
          "filename": data['filename']
        }
      },
      {},
      {"ext": ".html"}))
    .pipe(plumber({
      errorHandler: notify.onError("Error: <%= error.message %>") //<-
    }))
		.pipe(gulp.dest('./dist/'));
});

gulp.task('watch', function () {
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.ejs', ['ejs']);
});

gulp.task('default', ['watch']);
