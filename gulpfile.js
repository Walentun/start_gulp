const gulp = require('gulp');
const concat = require('gulp-concat');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const uglify = require('gulp-uglify');
const del = require('del');
const browserSync = require('browser-sync').create();
const sass = require('gulp-sass');
const imagemin = require('gulp-imagemin');
const cssFiles = [
    './node_modules/normalize.css/normalize.css',
    './src/sass/main.scss'
];

const jsFiles = [
    './src/js/main.js'
];

function styles(){
    return gulp.src(cssFiles)
                .pipe(concat('all.css'))
                .pipe(sass().on('error', sass.logError))
                .pipe(autoprefixer({
                    browsers: ['> 0.1%'], // уровень поддержки
                    cascade: false
                }))
                .pipe(cleanCSS({
                    level: 2 // уровень минификации
                }))
                .pipe(gulp.dest('./build/css'))
                .pipe(browserSync.stream());
}

function scripts(){
    return gulp.src(jsFiles)
                .pipe(concat('all.js'))
                .pipe(uglify({
                    toplevel: true
                }))
                .pipe(gulp.dest('./build/js'))
                .pipe(browserSync.stream());

}

function watch(){
    browserSync.init({
        server: {
            baseDir: "./"
        }
    });

    gulp.watch('./src/sass/**/*.scss', styles);
    gulp.watch('./src/js/**/*.js', scripts);
    gulp.watch('./*.html', browserSync.reload);
}

function img() {
    return gulp.src('./src/img/*')
        .pipe(imagemin())
        .pipe(gulp.dest('./build/img'));
}   

function clean(){
    return del(['build/*']);
}

gulp.task('styles', styles);
gulp.task('scripts', scripts);
gulp.task('watch', watch);
gulp.task('img', img);

gulp.task('build', gulp.series(clean, img,
                        gulp.parallel(styles, scripts)
                    ));

gulp.task('dev', gulp.series('build', 'watch'));