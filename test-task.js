var through2 = require("through2")
module.exports = function(){
  console.log("tsts")
  return through2(function(chunk, enc, cb){
    console.log(chunk)
    this.push(chunk);
    cb();
  })
}