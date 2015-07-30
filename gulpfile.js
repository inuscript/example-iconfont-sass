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
  var inj = transform(function(filename){
    return jsonSass({
      prefix: "$font:",
      suffix: " !default"
    })
  })
  // var quoted = transform(function(file){
  //   mapObj(file.data)
  // })
  return gulp.src(fontSetting.src)
    .pipe(iconfontGlyph({ 
      svgOptions: fontSetting.options,
      withQuote: true,
      withBackslash: true
    }))
    .pipe(transform(function(){
      return jsonSass({
        prefix: "$font:",
        suffix: " !default"
      })
    }))
    // .pipe(quoted)
    // .pipe(inj)
    .pipe(rename("font.scss"))
    .pipe(gulp.dest("./dest/auto-sass"))
})

gulp.task("sass", ["font-sass"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})
gulp.task("default", ["clean", "sass"])