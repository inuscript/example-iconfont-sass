var del = require("del")
var gulp = require("gulp")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var stream = require("stream")
var gulpSvgicons2svgfont = require('gulp-svgicons2svgfont')
var iconfontJson = require("gulp-iconfont-json")
var jsonSass = require("json-sass")

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
  return gulp.src(fontSetting.src)
    .pipe(iconfontJson(fontSetting.options))
    .pipe(jsonSass())
    .pipe(gulp.dest("./dest/scss/"))
})

gulp.task("sass", ["font-sass"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})
gulp.task("default", ["clean", "sass"])