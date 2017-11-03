"use strict";

var fs = require('fs');
var path = require('path');

const STATUS = {
  IDLE : "idle",
  EDITING : "editing",
  DEPLOYING : "deploying"
};

exports.STATUS = STATUS;

exports.ACTION = {
  EDITING : "editing",
  IDLE    : "idle"
};

exports.delete = function(baseFolder, filenames) {
  /*
  let file1 = path.join(folder, dataFilename);
  let file2 = path.join(folder, metaFilename);
  console.log("deleting", file1);
  console.log("deleting", file2);
  */
};


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

  return new Promise((resolve,reject) => {
    fs.writeFile(metadataFilePath, JSON.stringify(metadata,null,2),function(err) {
      if(err) {
        reject(err);
      } else {
        resolve(metadata);
      }
    });
  });
};

/**
 * Returns a list of war/meta file pairs.
 * Search in folder *folderPath* for all files satisfying following conditions :
 * - a file with same name and extension meta exist
 * - the meta file is json with a non empty moduleId property
 * Each item is returned as :
 *  {
 *  'dataFilename' : 'file.war',
 *  'metaFilename' : 'file.war.meta',
 *  'metadata' : {
 *      'moduleId' : 'XXXX'
 *  }
 * }
 * @param  {string} folderPath path to the folder to process
 * @return {array}            list of artefacts info.
 */
 exports.buildListFromLocalFolder = function(folderPath) {
   return new Promise( (resolve, reject) => {
     console.log('buildListFromLocalFolder');
      fs.readdir(folderPath, (err, files) => {
        if(err) {
          reject(err);
        } else {
          let result = files
          .filter( fileName     => fileName.toUpperCase().endsWith('.META')) // keep only meta files
          .map( metaFilename    => {   // for each metadata file, find its matching data file or NULL if not found
            let dataFilename = files.find( fileName => metaFilename.length > fileName.length && metaFilename.startsWith(fileName) );
            return {
              "metaFilename" : metaFilename,
              "dataFilename" : dataFilename || null
            };
          })
          .filter( file => file.dataFilename !== null) // only keep data/meta file pair
          .map( file => {                              // load all metadata files
            let fname = path.join(folderPath, file.metaFilename);
            try {
              file.metadata = JSON.parse(fs.readFileSync( fname, 'utf8'));
              // If the metadata does not contain a moduleId, consider it as invalid
              if( ! file.metadata.moduleId ) {
                file.metadata = null;
              }
            } catch (e) {
              console.warn("failed to load metadata from file "+fname,e);
            }
            return file;
          })
          .filter( file => file.metadata);          // ignore file with no metadata (load failure)
          resolve(result);
        }
      });
   });
 };
