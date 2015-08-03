var fs = require("fs")

var del = require("del")
var gulp = require("gulp")

var file = require('gulp-file')
var iconfont = require("gulp-iconfont")
var sass = require("gulp-sass")
var glyphsMap = require('iconfont-glyphs-map');
var jsonSassObj = require('json-sass-obj');

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

gulp.task("font-with-css", function(){
  return gulp.src(fontSetting.src)
    .pipe(iconfont(fontSetting.options))
      .on('glyphs', function(glyphs){
        file("_map.scss", JSON.stringify({
          name: fontSetting.options.fontName,
          path: fontSetting.options.dest,
          glyphs: glyphsMap(glyphs, true, true)
        }))
          .pipe(jsonSassObj({
            prefix: "$font: ",
            suffix: " !default;"
          }))
          .pipe(gulp.dest("./dest/scss"))
        gulp.src(["scss/*.scss","dest/scss/*.scss"])
          .pipe(sass())
          .pipe(gulp.dest("./dest/css"))
      })
    .pipe(gulp.dest(fontSetting.dest))

})
gulp.task("font-with-json", function(){
  return gulp.src(fontSetting.src)
    .pipe(iconfont(fontSetting.options))
      .on('glyphs', function(glyphs){
        file("codepoint.json", JSON.stringify(glyphsMap(glyphs, true, true)))
          .pipe(gulp.dest("./dest/json"))

      })
    .pipe(gulp.dest(fontSetting.dest))

})

gulp.task("default", ["clean", "font-with-json", "font-with-css"])