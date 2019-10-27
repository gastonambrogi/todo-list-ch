var gulp = require('gulp');
var sass = require('gulp-sass');
var browserSync = require('browser-sync').create();
var useref = require('gulp-useref');
var uglify = require('gulp-uglify');
var gulpIf = require('gulp-if');
var cssnano = require('gulp-cssnano');
var imagemin = require('gulp-imagemin');
var cache = require('gulp-cache');
var del = require('del');
// var runSequence = require('run-sequence');

// Basic Gulp task syntax
gulp.task('hello', function() {
  console.log('Hello Zell!');
})

// Development Tasks 
// -----------------

// Start browserSync server
function browserSyncTask(params) {
  browserSync.init({
    server: {
      baseDir: './app',
      index: 'index.html'
    }
  })
}
gulp.task('browserSync', browserSyncTask);

function sassTask() {
  return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
    .pipe(sass().on('error', sass.logError)) // Passes it through a gulp-sass, log errors to console
    .pipe(gulp.dest('app/css')) // Outputs it in the css folder
    .pipe(browserSync.stream());
}
gulp.task('sass', sassTask);

// Watchers
function watchTask() {
  gulp.watch('app/scss/**/*.scss', sassTask);
  gulp.watch('app/*.html').on('change', browserSync.reload);
  gulp.watch('app/js/**/*.js').on('change', browserSync.reload);
}
gulp.task('watch', watchTask);

// Optimization Tasks 
// ------------------

// Optimizing CSS and JavaScript 
function userefTask() {
  return gulp.src('app/*.html')
    .pipe(useref())
    .pipe(gulpIf('*.js', uglify()))
    .pipe(gulpIf('*.css', cssnano()))
    .pipe(gulp.dest('dist'));
}
gulp.task('useref', userefTask);

// Optimizing Images 
function imagesTask() {
  return gulp.src('app/images/**/*.+(png|jpg|jpeg|gif|svg)')
    // Caching images that ran through imagemin
    .pipe(cache(imagemin({
      interlaced: true,
    })))
    .pipe(gulp.dest('dist/images'))
}
gulp.task('images', imagesTask);

// Copying fonts 
function fontsTask() {
  return gulp.src('app/fonts/**/*')
    .pipe(gulp.dest('dist/fonts'))
}
gulp.task('fonts', fontsTask)

// Cleaning 
function cleanTask() {
  return del.sync('dist').then(function (cb) {
    return cache.clearAll(cb);
  });
}
gulp.task('clean', cleanTask)

function cleanDistTask(done) {
  del.sync(['dist/**/*', '!dist/images', '!dist/images/**/*']);
  done();
}
gulp.task('clean:dist', cleanDistTask);

// Build Sequences
// ---------------

gulp.task('default', gulp.series('sass', gulp.parallel('browserSync', 'watch')))

gulp.task('build', gulp.series(
  'clean:dist',
  'sass',
  gulp.parallel('useref', 'images', 'fonts')
))


