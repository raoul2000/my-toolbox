"use strict";

var fs = require('fs');
var Q = require('q');
var path = require('path');

exports.copyFileAsync = function(src,dest) {
  let source = fs.createReadStream(src);
  source.pipe(fs.createWriteStream(dest));

  source.on('end', function(){
    console.log("files copied");
  });
};
exports.copyFile = function(src,dest) {

  let source = fs.createReadStream(src);
  source.on('end', function(){
    console.log("files copied");
  });
  source.on('error', function(err){
    console.log("error", err);
  });

  source.pipe(fs.createWriteStream(dest));

};
