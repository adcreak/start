import pkg from 'gulp';
import bs from 'browser-sync';
import del from 'del';
import nunjucks from 'gulp-nunjucks';
import plumber from 'gulp-plumber';
import concat from 'gulp-concat';
import sass from 'gulp-dart-sass';
import autoprefixer from 'gulp-autoprefixer';
import cleancss from 'gulp-clean-css';
import sassGlob from 'gulp-sass-glob';
import uglifyEs from 'gulp-uglify-es';
import imagemin from 'gulp-imagemin';
import gulpif from 'gulp-if';

const { parallel, series, src, dest, watch } = pkg;
const uglify = uglifyEs.default;

let isProd = false;
export const cleandist = () => {
    return del('dist/**');
};
export const browser = () => {
    bs.init({
        server: { baseDir: 'dist/' },
        notify: false,
        online: false,
        browser: [ /* "firefox" ,  */ "chrome" /* "opera"  */ ]
    });
};
export const htmlbuild = () => {
    return src('app/pages/*.html')
        .pipe(plumber())
        .pipe(nunjucks.compile())
        .pipe(dest('dist'))
        .pipe(bs.stream());
};

export const styles = () => {
    return src('app/styles/index.scss')
        .pipe(sassGlob())
        .pipe(sass().on('error', sass.logError))
        .pipe(gulpif(isProd, autoprefixer({ overrideBrowserslist: ['last 1 versions'], grid: true })))
        .pipe(dest('app/styles/'))
        .pipe(gulpif(isProd, cleancss({ level: { 1: { specialComments: 0 } } /* , format: 'beautify'  */ })))
        .pipe(concat('index.min.css'))
        .pipe(dest('dist/css/'))
        .pipe(bs.stream());
};
export const fonts = () => {
    return src(['app/fonts/**/*'], { base: 'app' })
        .pipe(dest('dist'))
        .pipe(bs.stream());
};
export const images = () => {
    return src(['app/**/*.+(jpg|jpeg|gif|png|svg)'], { base: 'app' })
        // .pipe(imagemin())
        .pipe(dest('dist'))
        .pipe(bs.stream());
};
export const scripts = () => {
    return src([
        'app/js/vendor/*',
        'app/js/local/*',
        'app/js/index.js',
    ])
        .pipe(concat('index.js'))
        .pipe(dest('dist/js/'))
        .pipe(concat('index.min.js'))
        .pipe(uglify())
        .pipe(dest('dist/js/'))
        .pipe(bs.stream());
};
export const watching = () => {
    watch(['app/**/*.html'], htmlbuild);
    watch(['app/**/*.scss'], styles);
    watch(['app/fonts/**/*'], fonts);
    watch(['app/img/**/*'], images);
    watch(['app/js/**/*'], scripts);
};

export default series(
    cleandist,
    htmlbuild,
    styles,
    fonts,
    images,
    scripts,
    parallel(
        browser,
        watching,
    )
);
