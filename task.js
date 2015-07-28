var stream = require("stream")
var through2 = require("through2")
var plexer = require("plexer")
var gulpSvgicons2svgfont = require('gulp-svgicons2svgfont')


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

module.exports = function(opt){
  var inputStream = new Stream.Transform({ objectMode: true });
  var outputStream = new Stream.PassThrough({ objectMode: true });
  var stream = plexer({ objectMode: true }, inputStream, outputStream);

}