"use strict";

var execCmd = require('ssh-utils').exec.command;
var catFile = require('ssh-utils').readFileContent;

function md5Folder(cnx, folderPath) {

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

function diff(source, target) {

  source.forEach(function(src){
    var trg = target.find(function(trgItem){
      return src.path.replace(/fs1/,"FS") === trgItem.path.replace(/fs1/,"FS");
      //return src.path === trgItem.path;
    });
    src.existInTarget = trg !== undefined;
    src.md5Match =  src.existInTarget ? trg.md5 === src.md5 : undefined;
  });
  return source;
}

exports.diff = diff;

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
exports.render = render;
