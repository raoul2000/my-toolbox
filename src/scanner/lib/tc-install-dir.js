"use strict";

/**
 * Finds the Tomcat install folder name for a specific tomcat ID.
 * The path value returned is relative to the SSH user home directoy.
 *
 * @param  {[type]} options   [description]
 * @param  {[type]} tomcatId [description]
 * @return {[type]}          [description]
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
