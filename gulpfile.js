'use strict';
var gulp = require('gulp'),
    watch = require('gulp-watch'),
    preFixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    sass = require('gulp-sass'),
    sourceMaps = require('gulp-sourcemaps'),
    cleanCSS = require('gulp-clean-css'),
    rimRaf = require('rimraf'),
    imagemin = require('gulp-imagemin'),
    concat = require('gulp-concat'),
    json = JSON.stringify,
    browserSync = require('browser-sync'),
    ghpages = require('gh-pages'),
    reload = browserSync.reload;





var path = {
    build: {
        html: 'build',
        js: 'build/js/',
        css: 'build/css/',
        img: 'build/img/'
    },
    src: {
        html: 'src/*.html',
        js: 'src/js/**/*.js',
        style: 'src/sass/main.scss',
        img: 'src/img/**/*'
    },
    watch: {
        html: 'src/**/*.html',
        js: 'src/js/**/*.js',
        style: 'src/sass/**/*.scss',
        img: 'src/img/*'
    },
    clean: './build'
};

gulp.task("webserver", function () {
browserSync ({
    server: {
        baseDir: "./build"
    },
    host: 'localhost',
    port: 3000,
    tunnel: false
});
});

gulp.task('html:build', function() {
    gulp.src(path.src.html)
        .pipe(gulp.dest(path.build.html))
        .pipe(reload({stream:true}));
});

gulp.task('img:build', function() {
    gulp.src(path.src.img)
        .pipe(imagemin({}))
        .pipe(gulp.dest(path.build.img));
});

gulp.task('font:build', function() {
    gulp.src(['src/fonts/*'])
        .pipe(gulp.dest('build/fonts/'));
});

gulp.task('js:build', function() {
   gulp.src(path.src.js)
       .pipe(sourceMaps.init());
        return gulp.src(['./src/js/owl.carousel.js', './src/js/main.js'])
       .pipe(concat('main.js'))
       .pipe(uglify())
       .pipe(gulp.dest(path.build.js));
});

gulp.task('style:build', function () {
   gulp.src(path.src.style)
       .pipe(sourceMaps.init())
       .pipe(sass())
       .pipe(preFixer())
       .pipe(cleanCSS())
       .pipe(sourceMaps.write())
       .pipe(gulp.dest(path.build.css))
       .pipe(reload({stream: true}));
});

gulp.task('build', [
    'html:build',
    'style:build',
    'js:build',
    'img:build'
]);

gulp.task('watch', function() {
    watch([path.watch.js], function (ev, callback) {
       gulp.start('js:build');
    });
    watch([path.watch.html], function (ev, callback) {
        gulp.start('html:build');
    });
    watch([path.watch.style], function (ev, callback) {
        gulp.start('style:build');
    });
    watch([path.watch.img], function (ev, callback) {
        gulp.start('img:build');
    });
});

gulp.task('clean', function (callback) {
    rimRaf(path.clean, callback)
});

gulp.task('publish', ['build'], function(callback){
    ghpages.publish('build', function(err) {
        if (err) {
            console.log(err);
        }
        callback();
    });
});

gulp.task('default', ['build', 'webserver', 'watch']);