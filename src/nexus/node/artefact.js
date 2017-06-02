"use strict";

var fs = require('fs');
var Q = require('q');
var path = require('path');


exports.buildListFromLocalFolder = function(folderPath) {
  var deferred = Q.defer();
  let result = [], fileList = [];

  try {
    // read all files from folder and only keeps the ones with
    // extension '.war' and '.meta'. This is to avoid having to read the folder
    // again on the second step
    fs.readdir(folderPath, (err, files) => {
      files.forEach(file => {
        let filePath = path.join(folderPath, file );
        let ext = path.extname(file);
        let stat = fs.statSync(filePath);
        console.log(stat);
        if ( stat.isFile() && stat.size > 0 && (ext === ".war" || ext === ".meta")) {
          fileList.push(filePath);
        }
      });

      // setp 2 : keep only file pair (war/war.meta)
      let metadataFileFinder = function(metaFilename) {
        return function(x) {
          return  x === metaFilename;
        };
      };

      for (var i = 0; i < fileList.length; i++) {
        let fname = fileList[i];
        if(path.extname(fname) === '.war') {
          let fnameMeta = fname.concat('.meta');
          if( fileList.find(metadataFileFinder(fnameMeta)) ) {
            result.push({
              "filename" : fname,
              "basename" : path.basename(fname),
              "metadata" : JSON.parse(fs.readFileSync(fnameMeta, 'utf8'))
            });
          } else{
            result.push({
              "filename" : fname,
              "basename" : path.basename(fname),
              "metadata" : {
                "moduleId" : null,
                "symlink"  : null,
                "version"  : null,
                "installFolder" : null
              }
            });
          }
        }
      }
      deferred.resolve(result);
    });
  } catch (e) {
    deferred.reject(e);
  }
  return deferred.promise;
};
