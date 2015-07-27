var del = require("del")
var gulp = require("gulp")
var gutil = require("gulp-util")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var jsonSass = require("json-sass")
var stream = require("stream")
var through2 = require("through2")
var quote = require("quote")
var svgicons2svgfont = require('gulp-svgicons2svgfont')
var duplexer = require("plexer")
var PLUGIN_NAME = "iconfont-sass"

var iconfontValue = function(glyphs, options){
  var glp = (function(){
    var _glp = {}
    glyphs.forEach(function(glyph){
      _glp[glyph.name] = quote("\\" + glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase())
    })
    return _glp
  })()
  return {
    fontName: options.fontName,
    glyphs: glp
  }
}

var transform = function(options){
  return function(err, buf, cb){
    if(err) {
      cb(new gutil.PluginError(PLUGIN_NAME, err, {showStack: true}));
    }
    try{
      buf = new Buffer()
    }catch(err2) {
      cb(new gutil.PluginError(PLUGIN_NAME, err2, {showStack: true}));
    }
  }
}

var iconfontSass = function(options){
  return through2(function(file, buf, cb){
    var inStream = svgicons2svgfont(options)
    var glpyhs = null
    var outStream = inStream.on('glyphs', function(glyphs, option){
      var value = iconfontValue(glyphs, options)
      buf = new Buffer(value)
      cb(buf)

      return ;
      // value.path = quote(fontDestPath)
      // fakeSrc(value, "var/_fonts.scss")
      // .pipe(gulp.dest("scss/auto-generated"))
    })
  })
  // var duplexStream = duplexer({ objectMode: true }, inStream, outStream)
}

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
    // .pipe(iconfont(fontOpt))
    .pipe(iconfontSass(fontOpt))
    .pipe(gulp.dest(fontDestPath))
})

gulp.task("sass", ["font"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})

gulp.task("default", ["clean", "font", "sass"])