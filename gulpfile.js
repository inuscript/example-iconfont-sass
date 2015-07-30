var del = require("del")
var gulp = require("gulp")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var rename = require("gulp-rename");
var stream = require("stream")
var gulpSvgicons2svgfont = require('gulp-svgicons2svgfont')
var iconfontGlyph = require("gulp-iconfont-glyph")
var jsonSass = require("json-sass")
var streamify = require("gulp-streamify")
var source = require("vinyl-source-stream")
var transform = require("vinyl-transform")
var transformJsonSass = require("transform-json-sass")
var mapObj = require('map-obj');

gulp.task("clean", function(){
  del("dest")
})

var fontSetting = {
  src : ["svg/*.svg"],
  dest : "./dest/fonts",
  options : {
    fontName: "myFont",
    timestamp: 10
  }
}
gulp.task("font", function(){
  return gulp.src(fontSetting.src)
    .pipe(iconfont(fontSetting.options))
    .pipe(gulp.dest(fontSetting.dest))
})

gulp.task("font-sass",["font"], function(){
  return gulp.src(fontSetting.src)
    .pipe(iconfontGlyph({ 
      svgOptions: fontSetting.options,
      withQuote: true, // for scss, cannot sass quote and backslash
      withBackslash: true
    }))
    .pipe(transformJsonSass("font", true))
    .pipe(rename("font.scss"))
    .pipe(gulp.dest("./dest/auto-sass"))
})

gulp.task("sass", ["font-sass"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})
gulp.task("default", ["clean", "sass"])