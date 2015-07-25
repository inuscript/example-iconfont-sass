var gulp = require("gulp")
var gutil = require("gulp-util")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var jsonSass = require("json-sass")
var stream = require("stream")

var iconfontValue = function(glyphs, options){
  var glp = (function(){
    var _glp = {}
    glyphs.forEach(function(glyph){
      _glp[glyph.name] = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
    })
    return _glp
  })()
  return {
    fontName: options.fontName,
    glyphs: glp
  }
}

var fakeSrc = function(value){
  var scss = "$font: " + jsonSass.convertJs(value) + " !default;";
  var src = stream.Readable({objectMode: true})
  src._read = function () {
    this.push(new gutil.File({ cwd: "", base: "", path: "fake", contents: new Buffer(scss) }))
    this.push(null)
  }
  return src
}

gulp.task("default", function(){
  var fontDestPath = "./dest/fonts"
  gulp.src(["svg/*.svg"])
    .pipe(iconfont({
      fontName: "myFont",
      timestamp: 10
    }))
    .on("glyphs", function(glyphs, options){
      var value = iconfontValue(glyphs, options)
      value.fontPath = fontDestPath
      fakeSrc(value)
        .pipe(gulp.dest("./dest/scss/var/_font.scss"))
    })
    .pipe(gulp.dest(fontDestPath))
})
