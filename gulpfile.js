var del = require("del")
var gulp = require("gulp")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var stream = require("stream")
var gulpSvgicons2svgfont = require('gulp-svgicons2svgfont')
var svgicons2svgfont = require('svgicons2svgfont')
var iconfontSass = require("./task")

var fakeSrc = function(value, fileName){
  var scss = "$font: " + jsonSass.convertJs(value) + " !default;"
  var src = stream.Readable({objectMode: true})
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: fileName, contents: new Buffer(scss) }))
    this.push(null)
  }
  return src
}

gulp.task("clean", function(){
  del("dest")
})

gulp.task("font", function(){
  var fontDestPath = "./dest/fonts"
  var fontOpt = {
    fontName: "myFont",
    timestamp: 10
  }
  return gulp.src(["svg/*.svg"])
    .pipe(iconfont(fontOpt))
    .pipe(iconfontSass(fontOpt))
    .pipe(gulp.dest(fontDestPath))
})

gulp.task("sass", ["font"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})

gulp.task("default", ["clean", "font", "sass"])