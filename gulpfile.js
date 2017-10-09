const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const gulpif = require('gulp-if');
const babel = require('gulp-babel');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const through = require('through2');
const gls = require('gulp-live-server');
const del = require('del');
const runSequence = require('run-sequence');

const isEnvProduction = process.NODE_ENV === 'production';

const dirs = {
  src: 'public',
  dest: 'public'
}

const sassPaths = {
  src: `${dirs.src}/sass/main.scss`,
  dest: `${dirs.dest}/css/`
}

const jsPaths = {
  src: `${dirs.src}/js/src/**/*.js`,
  dest: `${dirs.dest}/js/`
}

const vendorSrc = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js'
]

const cleanFolders = [
  '/public/**/*',
  '!public/sass',
  '!public/js/src',
  '!public/favicon.png'
]

const fontsPaths = {
  fontAwesome: {
    src: './node_modules/font-awesome/fonts/**/*',
    dest: `${dirs.dest}/fonts/fontAwesome/`
  },
  bootstrap: {
    src: './node_modules/bootstrap-sass/assets/fonts/bootstrap/**/*',
    dest: `${dirs.dest}/fonts/bootstrap/`
  }
}

const logFileJsHelpers = () => {
  return through.obj((file, enc, cb) => {
    console.log(file.babel.usedHelpers);
    cb(null, file)
  });
}

gulp.task('clean', () => {
  return del(cleanFolders)
})

gulp.task('styles', () => {
  return gulp.src(sassPaths.src)
    .pipe(sourcemaps.init())
    .pipe(sass.sync().on('error', sass.logError))
    .pipe(autoprefixer())
    .pipe(gulpif(isEnvProduction, cleanCss()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(sassPaths.dest))
})

gulp.task('js', () => {
  return gulp.src(jsPaths.src)
    .pipe(sourcemaps.init())
    .pipe(babel())
    .pipe(logFileJsHelpers())
    .pipe(concat('main.js'))
    .pipe(gulpif(isEnvProduction, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsPaths.dest))
})

gulp.task('vendors', () => {
  return gulp.src(vendorSrc)
    .pipe(sourcemaps.init())
    .pipe(concat('vendors.js'))
    .pipe(gulpif(isEnvProduction, uglify()))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest(jsPaths.dest))
})

gulp.task('fonts:fontAwesome', () => {
  return gulp.src(fontsPaths.fontAwesome.src)
    .pipe(gulp.dest(fontsPaths.fontAwesome.dest))
})

gulp.task('fonts:bootstrap', () => {
  return gulp.src(fontsPaths.bootstrap.src)
    .pipe(gulp.dest(fontsPaths.bootstrap.dest))
})

gulp.task('fonts', ['fonts:fontAwesome', 'fonts:bootstrap'])

gulp.task('server', ['build'], () => {
  const server = gls.new('./app.js')
  return server.start();
})

gulp.task('build', () => {
  return runSequence(
    'clean', 
    ['vendors', 'fonts', 'styles', 'js']
  )}
);