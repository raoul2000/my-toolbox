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
exports.deployStandard = function(options, notify) {
  if(notify && typeof notify !== 'function') {
    return Promise.reject(new Error("argument notify must be a function"));
  }
  let ssh = new NodeSSH();

  let remoteFiletitle = path.basename(options.destFilepath);
  let remoteInstallFolderpath = path.dirname(options.destFilepath);

  //let cmdUncompress = `cd ${remoteInstallFolderpath} && jar -xvf "${remoteFiletitle}"`;
  let cmdCheckInstallFolderNotExist = `test ! -d "${remoteInstallFolderpath}"`;
  let cmdCreateInstallFolder = `mkdir "${remoteInstallFolderpath}"`;
  let cmdUncompress = `cd "${remoteInstallFolderpath}" && unzip -qo "${remoteFiletitle}"`;
  let cmdUpdateSymlink = `ln -sfn "${remoteInstallFolderpath}" "${options.symlinkPath}"`;
  let cmdDeleteUploadedFile = `rm "${options.destFilepath}"`;
  let progressMessage = '';

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
    }
  };
  // start the Promise chain
  sendNotification(`connecting to ${options.ssh.host}`);
  return ssh
  .connect(options.ssh)
  .then(() => {
    sendNotification(`test install folder doesn't exists : ${remoteInstallFolderpath}`);
    return ssh.execCommand(cmdCheckInstallFolderNotExist,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`create install folder : ${remoteInstallFolderpath}`);
    return ssh.execCommand(cmdCreateInstallFolder,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`copy file from ${options.srcFilepath} to remote ${options.destFilepath}`);
    return ssh.putFile(options.srcFilepath, options.destFilepath,null,{
      'step' : function(i) {
        console.log('total : '+i);
      }
    });
  })
  .then(() => {
    sendNotification(`uncompress archive : ${cmdUncompress}`);
    return ssh.execCommand(cmdUncompress,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`update symlink : ${cmdUpdateSymlink}`);
    return ssh.execCommand(cmdUpdateSymlink,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`delete uploaded file : ${cmdDeleteUploadedFile}`);
    return ssh.execCommand(cmdDeleteUploadedFile,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => ssh.dispose())
  .catch(err => {
    console.error('deployStandard',err);
    ssh.dispose();
    throw new Error(err);
  });
};
