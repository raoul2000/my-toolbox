"use strict";

var fs = require('fs');
var path = require('path');
const yaml = require('js-yaml');
const NodeSSH = require('node-ssh');


/**
 * options :
 * {
 *    ssh : {
 *      'host' : '127.0.0.1',
 *      'port' : 22,
 *      'username' : 'user',
 *      'password' : '*****'
 *    },
 *    'srcFilepath' : '/local/folder/module-1.3.3.war',
 *    'destFilepath' : '/remote/folder/mod-1.3.3/module-1.3.3.war',
 *    'symlinkPath'  : '/remote/folder/mod'
 * }
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.deployStandard = function(options) {
  let ssh = new NodeSSH();

  let remoteFiletitle = path.basename(options.destFilepath);
  let remoteInstallFolderpath = path.dirname(options.destFilepath);

  //let cmdUncompress = `cd ${remoteInstallFolderpath} && jar -xvf "${remoteFiletitle}"`;
  let cmdUncompress = `cd "${remoteInstallFolderpath}" && unzip -qo "${remoteFiletitle}"`;
  let cmdUpdateSymlink = `ln -sfn "${remoteInstallFolderpath}" "${options.symlinkPath}"`;
  let cmdDeleteUploadedFile = `rm "${options.destFilepath}"`;

  let cmdResultHandler = function(result) {
    if( result.code !== 0) {
      throw result;
    } else {
      console.log("stdout", result.stdout);
    }
  };

  return ssh
  .connect(options.ssh)
  .then(() => {
    console.log(`copy file from ${options.srcFilepath} to remote ${options.destFilepath}` );
    return ssh.putFile(options.srcFilepath, options.destFilepath);
  })
  .then(() => {
    console.log(`uncompress archive : ${cmdUncompress}`);
    return ssh.execCommand(cmdUncompress,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    console.log(`update symlink : ${cmdUpdateSymlink}`);
    return ssh.execCommand(cmdUpdateSymlink,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    console.log(`delete uploaded file : ${cmdDeleteUploadedFile}`);
    return ssh.execCommand(cmdDeleteUploadedFile,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => ssh.dispose())
  .catch(err => {
    console.error(err);
    ssh.dispose();
  });

};
