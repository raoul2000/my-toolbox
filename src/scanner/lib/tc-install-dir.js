"use strict";

const NodeSSH = require('node-ssh');

/**
 * Finds the Tomcat install folder name for a specific tomcat ID.
 * The path value returned is relative to the SSH user home directoy.
 *
 * @param  {[type]} options   [description]
 * @param  {[type]} tomcatId [description]
 * @return {[type]}          [description]
 */
function extractInstallDir(options, tomcatId, path) {

  var pattern = "*tomcat-"+tomcatId.toLowerCase();

  let cmd = (path !== undefined ?  'cd '+path+' ; ' : '') + 'ls -1d $PWD/'+pattern;
  let ssh = new NodeSSH();

  return ssh.connect(options)
  .then( () => {
    return ssh.execCommand(cmd,{  stream: 'stdout' });
  })
  .then( result => {
    ssh.dispose();
    console.log(result);
    return result.stdout.replace(/\n$/, '');
  })
  .catch(err => {
    console.error(err);
    ssh.dispose();
    throw new Error(err);
  });

}
exports.extractInstallDir = extractInstallDir;
