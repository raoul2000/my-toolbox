"use strict";

/**
 * Finds the Tomcat install folder name for a specific tomcat ID.
 * The path value returned is relative to the SSH user home directoy.
 *
 * This function assumes that the following convention applies :
 * being given a string (the tomcat id), the folder where the tomcat is installed
 * matches the patern '*tomcat-[tomcat ID]'.
 *
 * options : {
 *  ssh : Object NodeSSH,
 *  tomcatId : "ID1"
 * }
 * Note that options.ssh must be a valid NodeSSH instance already connected
 * to the remote server.
 *
 * returns SUCCESS: {
 *  "id" : "tc id",
 *  "installDir" : "/path/to/tomcat/install/dir"
 * }
 *
 * returns ERROR: {
 *  "id" : "tc id",
 *  "error" : {
 *    "code" : 2, // an error code different from 0
 *    "message" : "an error message"
 *  }
 * }
 * @param  {object} options   see comments
 * @return {Promise}
 */
function extractInstallDir(options) {

  console.log("extractInstallDir : options = ",options);
  let ssh = options.ssh;
  let tomcatId = options.tomcat.id;

  var pattern = "*tomcat-"+tomcatId.toLowerCase();

  //let cmd = (path !== undefined ?  'cd '+path+' ; ' : '') + 'ls -1d $PWD/'+pattern;
  let cmd =  'ls -1d $PWD/'+pattern;

  return ssh.execCommand(cmd,{  stream: 'stdout' })
  .then( cmdResult => {
    console.log(cmdResult);
    let result = {
      "id" : tomcatId
    };
    if( cmdResult.code === 0) {
      result.installDir = cmdResult.stdout.replace(/\n$/, '');
    } else {
      result.error = {
        "code"    : cmdResult.code,
        "message" : cmdResult.stdout
      };
    }
    return result;
  });
}
exports.extractInstallDir = extractInstallDir;
