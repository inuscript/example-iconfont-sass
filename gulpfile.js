var del = require("del")
var gulp = require("gulp")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var tsts = require("./test-task")
var stream = require("stream")
var gulpSvgicons2svgfont = require('gulp-svgicons2svgfont')
var iconfontGlyph = require("gulp-iconfont-glyph")
var jsonSass = require("json-sass")
var streamify = require("gulp-streamify")
var source = require("vinyl-source-stream")
var transform = require("vinyl-transform")


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

gulp.task("font-sass", function(){
  var inj = transform(function(filename){
    return jsonSass({
      prefix: "$font:",
      suffix: " !default"
    })
  })
  return gulp.src(fontSetting.src)
    .pipe(iconfontGlyph(fontSetting.options))
    .pipe(inj)
    .pipe(gulp.dest("./dest/scss/"))
})

gulp.task("sass", ["font-sass"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})
gulp.task("default", ["clean", "sass"])