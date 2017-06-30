"use strict";

var fs = require('fs');
var path = require('path');
const NodeSSH = require('node-ssh');

/**
 * List all files in the remote folder and calculate a MD5 on their content.
 *
 * Return : [
 *  { "md5" : '81a2aa505b2820fec6ee0b0fa515d8a3' , path : "/folder/folder/file1.txt"},
 *  { "md5" : '8f197698cdb25d56eb64187b46f345c8' , path : "/folder/folder/file2.txt"},
 *  etc ...
 * ]
 * @param  {object} cnx        connection info for SSH
 * @param  {string} folderPath path of the folder to process
 * @return {object}            array describing each files listed
 */
exports.md5Folder = function(cnx, folderPath, options, notify) {

  if(notify && typeof notify !== 'function') {
    return Promise.reject(new Error("argument notify must be a function"));
  }
  let ssh = new NodeSSH();


  // find  /home/meth01 -maxdepth 1 -type f  -exec md5sum "{}" +
  //   -maxdepth 1 : process the starting folder only
  //   -maxdepth 2 : process the starting folder and the subfolders
  //   etc ...
  //   see https://www.cyberciti.biz/faq/find-command-exclude-ignore-files/
  //   TO TEST
  //   find . -type f ! -path "./Movies/*.log" ! -path "./Downloads/*" ! -path "./Music/*"
  /*
  var script = ". .bash_profile\n"
    + "find "+folderPath+" -type f "
    +" ! -name \"*.log\""
    +" ! -name \"*.tmp\""
    +" -exec md5sum \"{}\" +";
    */

    let sendNotification = function(msg) {
      console.log(msg);
      if( notify ) {
        notify(msg);
      }
    };

    let cmdResultHandler = function(result) {
      if( result.code !== 0) {
        throw new Error(result);
      } else {
        console.log("stdout", result.stdout);
        return result.stdout;
      }
    };
    let cmdFind = `find "${folderPath}" -type f  -exec md5sum "{}" +`;
    // start the Promise chain
    sendNotification(`connecting to ${cnx.host}`);
    return ssh
    .connect(cnx)
    .then(() => {
      sendNotification(`running : ${cmdFind}`);
      return ssh.execCommand(cmdFind,[],{stream: 'stdout'}).then( cmdResultHandler );
    })
    .then((result) => {
      console.log("raw result = ", result);
      ssh.dispose();
      return result.split('\n')
      .map(function(entry){
        var pair = entry.split(/\s+/);
        return {
          "md5"  : pair[0],
          "path" : pair[1].replace(folderPath,'') // filepath relative to folderPath
        };
      })
      .filter(function(entry){
        return entry.md5.length !== 0;
      });
    })
    .catch(err => {
      console.error('md5Folder',err);
      ssh.dispose();
      throw new Error(err);
    });
};

/**
 * Compute the diff between source and target.
 * 'source and 'target' are arrays containing a list of objects, each one describing a file.
 * example : [
 *  { md5 : "12EE34", path : "/folder/file.txt"}
 * ]
 * The comparaison is done ONE WAY, taking 'source' as the reference list.
 * The returned object is  the "source" object where each object has 2 new properties :
 * - existInTarget : boolean
 * - md5match : boolean
 *
 * @param  {array} source list of objects describing files in the SOURCE location
 * @param  {array} target  list of objects describing files in the TARGET location
 * @return {[type]}        [description]
 */
function diff(source, target) {

  source.forEach(function(src){
    var trg = target.find(function(trgItem){
      return src.path === trgItem.path;
    });
    src.existInTarget = trg !== undefined;
    src.md5Match =  src.existInTarget ? trg.md5 === src.md5 : undefined;
  });
  return source;
}

exports.diff = diff;
