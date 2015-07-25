var gulp = require("gulp")
var gutil = require("gulp-util")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var jsonSass = require("json-sass")
var stream = require("stream")
var through2 = require("through2")
var iconfontValue = function(glyphs, options){
  var glp = (function(){
    var _glp = {}
    glyphs.forEach(function(glyph){
      _glp[glyph.name] = '"\\' + glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase() + '"'
    })
    return _glp
  })()
  return {
    fontName: options.fontName,
    glyphs: glp
  }
}

var fakeSrc = function(value, fileName){
  var scss = "$font: " + jsonSass.convertJs(value) + " !default;";
  var src = stream.Readable({objectMode: true})
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: fileName, contents: new Buffer(scss) }))
    this.push(null)
  }
  return src
}

gulp.task("font", function(){
  var fontDestPath = "./dest/fonts"
  return gulp.src(["svg/*.svg"])
    .pipe(iconfont({
      fontName: "myFont",
      timestamp: 10
    }))
    .on("glyphs", function(glyphs, options){
      var value = iconfontValue(glyphs, options)
      fakeSrc(value, "var/_fonts.scss")
        .pipe(gulp.dest("scss/auto-generated"))
    })
    .pipe(gulp.dest(fontDestPath))
})

gulp.task("sass", ["font"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})

gulp.task("default", ["font", "sass"])