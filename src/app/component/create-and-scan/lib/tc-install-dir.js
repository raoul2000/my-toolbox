"use strict";

/**
 * Finds the Tomcat install folder name for a specific tomcat ID.
 * The path value returned is relative to the SSH user home directoy.
 *
 * This function assumes that the following convention applies :
 * being given a string (the tomcat id), the folder where the tomcat is installed
 * matches the patern '*tomcat-[tomcat ID]'.
 *
 * returns : {
 *  "id" : "tc id",
 *  "installDir" : "/path/to/tomcat/install/dir"
 * }
 * @param  {object} options   a valid SSH2 object instance
 * @param  {string} tomcatId the tomcat id
 * @return {object}          object describing the result
 */
function extractInstallDir(ssh, tomcatId, path) {

  var pattern = "*tomcat-"+tomcatId.toLowerCase();

  let cmd = (path !== undefined ?  'cd '+path+' ; ' : '') + 'ls -1d $PWD/'+pattern;

  return ssh.execCommand(cmd,{  stream: 'stdout' })
  .then( result => {
    console.log(result);
    return {
      "id" : tomcatId,
      "installDir" : result.stdout.replace(/\n$/, '')
    };
  });
}
exports.extractInstallDir = extractInstallDir;
