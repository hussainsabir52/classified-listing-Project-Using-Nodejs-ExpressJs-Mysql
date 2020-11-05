var gulp = require('gulp');
var sass = require('gulp-sass');
var watch = require('gulp-watch');
var concat = require('gulp-concat');
var concatCss = require('gulp-concat-css');
var bower = require('gulp-bower');
var browserSync = require('browser-sync').create();
gulp.task('sass', function () {
    return gulp.src('app/scss/**/*.scss') // Gets all files ending with .scss in app/scss and children dirs
            .pipe(sass())
            .pipe(gulp.dest('app/css'));
});
//watch for changes style.scss
gulp.task('watch', function () {
    gulp.watch('app/scss/**/*.scss', ['sass']);
    // Other watchers
});


//all js plugins concat
gulp.task('concat', function () {
    return gulp.src([
        'app/bower_components/jquery/dist/jquery.min.js',
        'app/bower_components/bootstrap/dist/js/bootstrap.min.js',
        'app/bower_components/owl.carousel/dist/owl.carousel.min.js',
        'app/bower_components/bootstrap-select/dist/js/bootstrap-select.min.js',
        'app/bower_components/jarallax/dist/jarallax.min.js',
        'app/bower_components/jarallax/dist/jarallax-video.min.js',
        'app/bower_components/dropzone/dist/dropzone.js'
    ])
            .pipe(concat('all.js'))
            .pipe(gulp.dest('app/js/plugins'));
});

//css plugins concatCss
gulp.task('concatCss', function () {
    return gulp.src([
        'app/bower_components/bootstrap/dist/css/bootstrap.min.css',
        'app/bower_components/font-awesome/css/font-awesome.min.css',
        'app/bower_components/owl.carousel/dist/assets/owl.theme.default.min.css',
        'app/bower_components/owl.carousel/dist/assets/owl.carousel.min.css',
        'app/bower_components/bootstrap-select/dist/css/bootstrap-select.min.css',
        'app/bower_components/dropzone/dist/dropzone.css'
    ])
            .pipe(concatCss("bundle.css"))
            .pipe(gulp.dest('app/css'));
});

gulp.task('bower', function () {
    return bower();
});


//browser sync
gulp.task('browserSync', function() {
  browserSync.init({
    server: {
      baseDir: 'app'
    }
  });
});