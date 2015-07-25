var gulp = require("gulp")
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var jsonSass = require("json-sass/lib/jsToSassString")
gulp.task("default", function(){

  gulp.src(["svg/*.svg"])
    .pipe(iconfont({
      fontName: "myFont",
    }))
    .on("glyphs", function(glyphs, options){
      var glp = (function(){
        var _glp = {}
        glyphs.forEach(function(glyph){
          _glp[glyph.name] = glyph.unicode[0].charCodeAt(0).toString(16).toUpperCase()
        })
        return _glp
      })()
      var vars = jsonSass({
        fontName: "myFont",
        fontPath: "./dest/fonts/",
        glyphs: glp
      })
      console.log(vars)
    })
    .pipe(gulp.dest("./dest/fonts"))
})
