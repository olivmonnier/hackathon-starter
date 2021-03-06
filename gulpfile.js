const gulp = require('gulp');
const sass = require('gulp-sass');
const autoprefixer = require('gulp-autoprefixer');
const sourcemaps = require('gulp-sourcemaps');
const cleanCss = require('gulp-clean-css');
const gulpif = require('gulp-if');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const imagemin = require('gulp-imagemin');
const gls = require('gulp-live-server');
const del = require('del');
const babelify = require('babelify');
const browserify = require('browserify');
const buffer = require('vinyl-buffer');
const source = require('vinyl-source-stream');
const runSequence = require('run-sequence');
const wbBuild = require('workbox-build');

const isEnvProduction = process.NODE_ENV === 'production';

const dirs = {
  src: 'public/src',
  dest: 'public/dist'
}

const imagesPath = {
  src: `${dirs.src}/images/**/*`,
  dest: `${dirs.dest}/images/`
}

const sassPaths = {
  src: `${dirs.src}/sass/main.scss`,
  dest: `${dirs.dest}/css/`
}

const jsPaths = {
  src: `${dirs.src}/js/main.js`,
  dest: `${dirs.dest}/js/`
}

const vendorSrc = [
  './node_modules/jquery/dist/jquery.js',
  './node_modules/bootstrap-sass/assets/javascripts/bootstrap.js',
  './node_modules/bootstrap-select/dist/js/bootstrap-select.js',
  './node_modules/magnific-popup/dist/jquery.magnific-popup.js'
]

const cleanFolders = [
  'public/dist'
]

const filesToCopy = [
  `${dirs.src}/favicon.png`,
  `${dirs.src}/sw.js`
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

gulp.task('clean', () => {
  return del(cleanFolders)
})

gulp.task('images', () => {
  return gulp.src(imagesPath.src)
    .pipe(imagemin())
    .pipe(gulp.dest(imagesPath.dest))
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
  const bundler = browserify({
    entries: jsPaths.src,
    debug: true
  })
  bundler.transform(babelify);

  return bundler.bundle()
    .on('error', function (err) { console.error(err) })
    .pipe(source('main.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({ loadMaps: true }))
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

gulp.task('copy', () => {
  return gulp.src(filesToCopy)
    .pipe(gulp.dest(dirs.dest))
})

gulp.task('bundle-sw', () => {
  return wbBuild.generateSW({
    globDirectory: './public/dist/',
    swDest: './public/dist/sw.js',
    globPatterns: ['**\/*.{html,js,css,eot,svg,ttf,woff,woff2}'],
  })
  .then(() => {
    console.log('Service worker generated.');
  })
  .catch((err) => {
    console.log('[ERROR] This happened: ' + err);
  });
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

  server.start()
  gulp.watch(`${dirs.src}/sass/**/*.scss`, ['styles'])
  gulp.watch(`${dirs.src}/js/**/*.js`, ['js'])
})

gulp.task('build', () => {
  return runSequence(
    'clean', 
    ['images', 'styles', 'js', 'vendors', 'fonts', 'copy'],    
    'bundle-sw'
  )}
);