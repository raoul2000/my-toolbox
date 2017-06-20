"use strict";

const mkdirp = require('mkdirp'); // TODO : replace with fs-extra
const path = require('path');
const fs = require('fs');

/**
 * Create a temporary local file to store a remote file.
 *
 * @param  {object} connection     { host : 'ip or name', username : "name"}
 * @param  {string} remoteFilepath absolute remote file path
 * @param  {string} basePath       absolute local file path
 * @return {[type]}                [description]
 */
function createTmpLocalFile (connection, remoteFilepath, basePath) {
  if(! path.isAbsolute(basePath)) {
    throw new Error("absolute base path is required : "+basePath);
  }
  if( ! fs.existsSync(basePath) ) {
    throw new Error("base path does not exist : "+basePath);
  }

  var tmpFilepath = path.join(
    basePath,
    connection.username + '@' + connection.host,
    remoteFilepath
  );

  var tmpFolderpath = path.dirname(tmpFilepath);
  if( ! fs.existsSync(tmpFolderpath)) {
    mkdirp.sync(tmpFolderpath);
  }
  fs.closeSync(fs.openSync(tmpFilepath, 'w'));
  return tmpFilepath;
}

exports.createTmpLocalFile = createTmpLocalFile;
