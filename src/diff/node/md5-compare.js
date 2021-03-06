"use strict";

var execCmd = require('ssh-utils').exec.command;
var catFile = require('ssh-utils').readFileContent;

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
function md5Folder(cnx, folderPath, options) {

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
  var prepareArgument = function(arg) {
    return "\""+arg+"\"";
  };
  var script = ". .bash_profile\n"
    + "find "+folderPath+" -type f ";
  if(options) {
    if(options.include && options.include.length !== 0) {
      script = script + " -name "+ prepareArgument(options.include);
    }

    if(options.exclude && options.exclude.length !== 0) {
      script = script + " ! -name "+ prepareArgument(options.exclude);
    }
  }
  script = script + " -exec md5sum \"{}\" +";

  console.log("cmd = "+script);
  return execCmd(cnx, script)
  .then(function(result){
    return result.value.split('\n')
    .map(function(entry){
      var pair = entry.split(/\s+/);
      return {
        "md5"  : pair[0],
        "path" : pair[1]
      };
    })
    .filter(function(entry){
      return entry.md5.length !== 0;
    });
  })
  .fail(function(error){
    return error;
  });
}


function md5Folder_orig(cnx, folderPath) {

  // find  /home/meth01 -maxdepth 1 -type f  -exec md5sum "{}" +
  //   -maxdepth 1 : process the starting folder only
  //   -maxdepth 2 : process the starting folder and the subfolders
  //   etc ...
  //   see https://www.cyberciti.biz/faq/find-command-exclude-ignore-files/
  //   TO TEST
  //   find . -type f ! -path "./Movies/*.log" ! -path "./Downloads/*" ! -path "./Music/*"
  var script = ". .bash_profile\n" +
  "find "+folderPath+" -type f -exec md5sum \"{}\" +";

  return execCmd(cnx, script)
  .then(function(result){
    return result.value.split('\n')
    .map(function(entry){
      var pair = entry.split(/\s+/);
      return {
        "md5"  : pair[0],
        "path" : pair[1]
      };
    })
    .filter(function(entry){
      return entry.md5.length !== 0;
    });
  })
  .fail(function(error){
    return error;
  });
}
exports.md5Folder = md5Folder;

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
      //return src.path.replace(/fs1/,"FS") === trgItem.path.replace(/fs1/,"FS");
      return src.path === trgItem.path;
    });
    src.existInTarget = trg !== undefined;
    src.md5Match =  src.existInTarget ? trg.md5 === src.md5 : undefined;
  });
  return source;
}

exports.diff = diff;

// Not used anymore
function render(path, file) {
  console.log("\n\nCOMPARE "+path+ " ======== \n\n");
  file.forEach(function(item){
    var str = "";
    if(item.existInTarget) {
      if(item.md5Match) {
        str += "ok ";
      }  else {
        str += "KO ";
      }
    } else {
      str += "?? ";
    }
    console.log(str + " | " + item.path);
  });
  console.log("\n\n = end ======= \n\n");
}
//exports.render = render;
