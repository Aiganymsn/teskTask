const { src, dest, series, watch } = require('gulp') 
const sass = require('gulp-sass')(require('sass'))
const csso = require('gulp-csso')
const include = require('gulp-file-include')
const htmlmin = require('gulp-htmlmin')
const del = require('del')
const concat = require('gulp-concat')
const autoprefixer = require('gulp-autoprefixer')
const sync = require('browser-sync').create()
const imagemin = require('gulp-imagemin')
const minifyJs = require('gulp-uglify')

function html() {
   return src('src/**.html')
    .pipe(include({
       perfix: '@@'
    }))
    .pipe(htmlmin({
       collapseWhitespace: true
    }))
    .pipe(dest('dist'))
}

function img() {
   return src('src/img/*')
   .pipe(imagemin())
   .pipe(dest('dist/img'))
}

function json() {
   return src('src/data/**.json')
   .pipe(dest('dist/data/'))
}

 function scss() {
    return src('src/scss/**.scss')
     .pipe(sass())
     .pipe(autoprefixer({
      cascade: false
     }))
     .pipe(csso())
     .pipe(concat('index.css'))
     .pipe(dest('dist'))
 }

 function js() {
    return src('src/js/**.js')
    .pipe(minifyJs())
    .pipe(concat('index.js'))
    .pipe(dest('dist'))
 }

 function clear() {
    return del('dist')
 }

function serve() {
   sync.init({
      server: './dist'
   })

   watch('src/**.html', series(html)).on('change', sync.reload)
   watch('src/scss/**.scss', series(scss)).on('change', sync.reload)
   watch('src/js/**.js', series(js)).on('change', sync.reload)
}

exports.build = series(clear, scss, img, html, js, json)
exports.serve = series(clear, scss, img, html, js, json, serve)
exports.clear = clear 
