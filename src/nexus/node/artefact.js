"use strict";

var fs = require('fs');
var Q = require('q');
var path = require('path');


exports.saveMetadata = function(metadataFilePath, metadata) {
  console.log("metadataFilePath = "+metadataFilePath);
  console.log("metadata : ",metadata);

  let deferred = Q.defer();
  fs.writeFile(metadataFilePath, JSON.stringify(metadata,null,2),function(err) {
    if(err) {
      deferred.reject(err);
    } else {
      deferred.resolve(metadata);
    }
  });
  return deferred.promise;
};

exports.buildListFromLocalFolder = function(folderPath) {
  var deferred = Q.defer();
  let result = [], fileList = [];

  try {
    // read all files from folder and only keeps the ones with
    // extension '.war' and '.meta'. This is to avoid having to read the folder
    // again on the second step (to get metadata files)
    fs.readdir(folderPath, (err, files) => {
      files.forEach(file => {
        let filePath = path.join(folderPath, file );
        let ext = path.extname(file);
        let stat = fs.statSync(filePath);
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
          // for each '.war' file, check its corresponding metadata file
          let fnameMeta = fname.concat('.meta');
          let finfo =  {
            "filename" : fname,
            "basename" : path.basename(fname),
            "metadata" : null
          };

          if( fileList.find(metadataFileFinder(fnameMeta)) ) {
            // this file has also metadata : try to load the metadata file
            // but ignore error (metadata will be overwritten)
            //
            try {
              finfo.metadata = JSON.parse(fs.readFileSync(fnameMeta, 'utf8'));
            } catch (e) {
              console.warn("failed to load metadata from file "+fname,e);
              finfo.metadata = null;
            }
          }
          // failed to read the md file .. or no md file : create a new one
          // and try to save it
          if( finfo.metadata === null) {
            finfo.metadata =  {
              "moduleId" : null,
              "symlink"  : null,
              "version"  : null,
              "installFolder" : null
            };
            try {
              fs.writeFileSync(fnameMeta, JSON.stringify(finfo.metadata, null ,2));
            } catch (e) {
              console.warn("failed to save metadata file "+fnameMeta,e);
            }
          }
          result.push(finfo);
        }
      }
      deferred.resolve(result);
    });
  } catch (e) {
    deferred.reject(e);
  }
  return deferred.promise;
};
