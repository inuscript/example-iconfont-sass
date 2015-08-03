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
gulp.task("font", function(){
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
// 
// gulp.task("font-sass",["font"], function(){
//   return
//   return gulp.src(fontSetting.src)
//     .pipe(iconfontGlyph({ 
//       svgOptions: fontSetting.options,
//       withQuote: true, // for scss, cannot sass quote and backslash
//       withBackslash: true
//     }))
//     .pipe(transformJsonSass("font", true))
//     .pipe(gulp.dest("./dest/auto-sass"))
// })

gulp.task("sass", ["font-sass"], function(){
  gulp.src("scss/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./dest/css"))
})
gulp.task("default", ["clean", "sass"])