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
const svgmin  = require('gulp-svgmin');
const changed = require('gulp-changed');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');  // 圧縮率を高めるのにプラグインを入れる png
const mozjpeg = require('imagemin-mozjpeg');

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
          "url": "https://www.example.com",
          "og_image": "https://www.example.com/common/img/og.jpg"
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

gulp.task('images', () => {
  return gulp.src('./src/**/*.{png,jpg,gif}')
    .pipe(changed('./dist/'))  // src と dist を比較して異なるものだけ処理
    .pipe(imagemin([
      pngquant({
        quality: '65-80',  // 画質
        speed: 1,  // 最低のスピード
        floyd: 0,  // ディザリングなし
      }),
      mozjpeg({
        quality: 85, // 画質
        progressive: true
      }),
      imagemin.optipng(),
      imagemin.gifsicle()
    ]))
    .pipe(gulp.dest('./dist/'))  // 保存
    .pipe(notify('images task finished'));
});

gulp.task('svg', () => {
  return gulp.src('src/svg/**/*.svg')
    .pipe(svgmin({
      plugins: [{
        removeDoctype: true
      }, {
        removeComments: true
      }, {
        cleanupNumericValues: {
          floatPrecision: 3
        }
      }, {
        convertColors: {
          names2hex: false,
          rgb2hex: false
        }
      }]
    }))
    .pipe(gulp.dest('./dist/'));
});

gulp.task('watch', () => {
  gulp.watch('./src/**/*.scss', ['sass']);
  gulp.watch('./src/**/*.ejs', ['ejs']);
});

gulp.task('default', ['watch']);
