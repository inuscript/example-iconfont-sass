var stream = require("stream")
var through2 = require("through2")
var plexer = require("plexer")
var svgicons2svgfont = require('gulp-svgicons2svgfont')
var iconfont = require('gulp-iconfont')
var quote = require("quote")
var jsonSass = require("json-sass")
var gutil = require("gulp-util")

var PLUGIN_NAME = "iconfont-sass"

var glyphsMap = function(glyphs){
  var glp = (function(){
    var _glp = {}
    glyphs.forEach(function(glyph){
      _glp[glyph.name] = quote("\\" + glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase())
    })
    return _glp
  })()
  return {
    glyphs: glp
  }
}

module.exports = function(options){
  var inputStream = svgicons2svgfont(options)
  // var inputStream = iconfont(options)
  var outputStream = new stream.PassThrough({ objectMode: true });
  var _glyphs = undefined;
  var _opt = undefined;
  inputStream.on('glyphs', function(glyphs, options){
    _glyphs = glyphs // memorize
    _opt = options
  }).pipe(through2.obj(function(file, enc, cb){
    console.log(arguments)
    var value = glyphsMap(_glyphs)
    var scss = "$font: " + jsonSass.convertJs(value) + " !default;"
    outputStream.push(new gutil.File({ cwd: "", base: "", path: "aaa.scss", contents: new Buffer(scss) }))
    outputStream.end();
  }))
  var duplexStream = plexer({ objectMode: true }, inputStream, outputStream)
  return duplexStream
}