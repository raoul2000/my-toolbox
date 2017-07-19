"use strict";

var fs = require('fs');
var Q = require('q');
var path = require('path');

/**
 * Updates or create metadataFilePath with the JSON metadata
 *
 * @param  {string} metadataFilePath the file path
 * @param  {object} metadata         metadata to save
 * @return {Promise}
 */
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

/**
 * Browse folderPath and returns a list of files.
 * Select files must have a '.war' extension.
 * If no metadata is found for a war file, it is created with empty (null) values
 * otherwise it is loaded and returned in the 'metadata' property.
 *
 * artefact Info = {
 *  'filename' : '/folder/file.war',
 *  'basename' : 'file.war',
 *  'metadata' : {
 *      "moduleId" : string | null,
 *      "symlink"  : string | null,
 *      "version"  : string | null,
 *      "installFolder" : string | null
 *  }
 * }
 * @param  {string} folderPath path to the folder to process
 * @return {array}            list of artefacts info.
 */
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


        if ( stat.isFile() && stat.size > 0 && (
          file.toUpperCase().endsWith('.WAR') ||
          file.toUpperCase().endsWith('.TAR.GZ') ||
          file.toUpperCase().endsWith('.META')
        )) {
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
        if( fname.toUpperCase().endsWith('.WAR') ||
            fname.toUpperCase().endsWith('.TAR.GZ')
          ) {
          // for each '.war' or '.tar.gz' file, check its corresponding metadata file
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
