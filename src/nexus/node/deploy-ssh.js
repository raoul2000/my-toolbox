"use strict";

var fs = require('fs');
var path = require('path');
const yaml = require('js-yaml');
const NodeSSH = require('node-ssh');


/* script example ----------------------------------------------------

#!/bin/bash

. "$HOME"/.bash_profile

set -u
set -e

SCRIPT_HOME=$(dirname "$0")
SCRIPT_NAME=$(basename "$0")
EXIT_CODE=0

echo "start:"
echo "cwd:$(pwd)"
echo "args: $*"


dfgdfg


echo "done:$EXIT_CODE"
exit $EXIT_CODE
 */

/** -----------------------------------------------------------------
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
 *    'symlinkPath'  : '/remote/folder/mod',  // not used
 *    'script' : {
 *      'srcFilepath' : "c:\folder\install.bash",
 *      "destFilepath" : "/remote/folder/install.bash",
 *      'arg' : [
 *        "arg1" , "arg2", "arg3"
 *      ]
 *    }
 * }
 * @param  {[type]} options [description]
 * @return {[type]}         [description]
 */
exports.deployByScript = function(options,notify) {

  if(notify && typeof notify !== 'function') {
    return Promise.reject(new Error("argument notify must be a function"));
  }
  let ssh = new NodeSSH();

  let remoteFiletitle = path.basename(options.destFilepath);
  let remoteInstallFolderpath = path.dirname(options.destFilepath);

  //let cmdUncompress = `cd ${remoteInstallFolderpath} && jar -xvf "${remoteFiletitle}"`;
  let cmdCheckInstallFolderNotExist = `test ! -d "${remoteInstallFolderpath}"`;
  let cmdCreateInstallFolder = `mkdir "${remoteInstallFolderpath}"`;
  let cmdSetScriptPermission = `chmod u=rwx "${options.script.destFilepath}"`;
  let cmdDeleteUploadedFile = `rm "${options.destFilepath}"`;
  let cmdDeleteUploadedScript = `rm "${options.script.destFilepath}"`;
  let progressMessage = '';

  let sendNotification = function(msg,info) {
    console.log(msg,info);
    if( notify ) {
      notify(msg, info);
    }
  };

  let cmdResultHandler = function(result) {
    if( result.code !== 0) {
      console.error("Edit code = ", result.code);
      console.error("STDERR::\n",result.stderr);
      throw new Error(result);
    } else {
      console.log("STDOUT::\n", result.stdout);
    }
  };

  ///// start SSH sequence /////////////////////////////////////////////////////////////
/*

sendNotification(`connecting to ${options.ssh.host}`);
  return ssh.connect(options.ssh).then(() => {
      sendNotification(`execute remote script : ${options.script.destFilepath}`);
      return ssh.exec(options.script.destFilepath, options.script.arg,{stream: 'both'}).then(cmdResultHandler);
    })
    .then(result => {
      //console.log("result : \n",result);
      ssh.dispose();
    })
      .catch(err => {
        console.error('deployByScript',err);
        ssh.dispose();
        throw new Error(err);
      });
      /////

      */
  sendNotification(`connecting to ${options.ssh.host}`);
  return ssh
  .connect(options.ssh)
  .then(() => {
    sendNotification(`ensure that install folder doesn't exists : ${remoteInstallFolderpath}`);
    return ssh.execCommand(cmdCheckInstallFolderNotExist,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`create install folder : ${remoteInstallFolderpath}`);
    return ssh.execCommand(cmdCreateInstallFolder,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`upload local file from ${options.srcFilepath} to remote ${options.destFilepath}`);
    return ssh.putFile(options.srcFilepath, options.destFilepath,null,{
      'step' : function(total_transferred, chunk, total) {
        //console.log('total_transferred : '+total_transferred);
        //console.log('chunk : '+chunk);
        //console.log('total : '+total);
        let percent = Math.floor((total_transferred / total) * 100);
        console.log(percent);
        sendNotification(`upload local file from ${options.srcFilepath} to remote ${options.destFilepath}`,{
          "operation" : "upload",
          "percent" : percent
        });
      }
    });
  })
  .then(() => {
    sendNotification(`upload install script from ${options.script.srcFilepath} to remote ${options.script.destFilepath}`);
    return ssh.putFile(options.script.srcFilepath, options.script.destFilepath,null,{
      'step' : function(total_transferred, chunk, total) {
        //console.log('total_transferred : '+total_transferred);
        //console.log('chunk : '+chunk);
        //console.log('total : '+total);
        let percent = Math.floor((total_transferred / total) * 100);
        console.log(percent);
        sendNotification(`upload local script from ${options.script.srcFilepath} to remote ${options.script.destFilepath}`,{
          "operation" : "upload",
          "percent" : percent
        });
      }
    });
  })
  .then(() => {
    sendNotification(`set permission on script : ${options.script.destFilepath}`);
    return ssh.execCommand(cmdSetScriptPermission,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`execute remote script : ${options.script.destFilepath}`);
    return ssh.exec(options.script.destFilepath, options.script.arg,{stream: 'both'}).then( cmdResultHandler );
  })
  .then(() => ssh.dispose())
  .catch(err => {
    console.error('deployByScript',err);
    ssh.dispose();
    throw new Error(err);
  });
};

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

  let sendNotification = function(msg,info) {
    console.log(msg,info);
    if( notify ) {
      notify(msg, info);
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
    sendNotification(`upload local file from ${options.srcFilepath} to remote ${options.destFilepath}`);
    return ssh.putFile(options.srcFilepath, options.destFilepath,null,{
      'step' : function(total_transferred, chunk, total) {
        //console.log('total_transferred : '+total_transferred);
        //console.log('chunk : '+chunk);
        //console.log('total : '+total);
        let percent = Math.floor((total_transferred / total) * 100);
        console.log(percent);
        sendNotification(`upload local file from ${options.srcFilepath} to remote ${options.destFilepath}`,{
          "operation" : "upload",
          "percent" : percent
        });
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
