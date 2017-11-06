"use strict";

var fs = require('fs');
var path = require('path');
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

exports.run = function(args) {

  let options = args;
  let notify = null;
  //let notify  = args.notify;

  // validate options //////////////////////////////////////////////////////////
  if(notify && typeof notify !== 'function') {
    return Promise.reject(new Error("argument notify must be a function"));
  }

  // do we have an installer script ?
  let runRemoteScript = null;
  if( options.script && options.script.srcFilepath && options.script.destFilepath) {
    runRemoteScript = options.script;
  }

  // define private function //////////////////////////////////////////////////
  var _notify = function(event, data) {
    console.log("event : ",event, "data : ",data);
    if( options.notifier ) {
      console.log("event emitted");
      options.notifier.emit(event, data);
    }
  };

  let previousPercent = -1;
  let progressHandler = function(total_transferred, chunk, total) {
    let percent = Math.floor((total_transferred / total) * 100);
    if( percent > previousPercent ) {
      _notify("upload-progress", percent);
      previousPercent = percent;
    }
  };

  let cmdResultHandler = function(result) {
    if( result.code !== 0) {
      console.error("Edit code = ", result.code);
      console.error("STDERR::\n",result.stderr);
      throw new Error(result);
    } else {
      console.log("STDOUT::\n", result.stdout);
      return true;
    }
  };

  // Start the SSH Deploy process //////////////////////////////////////////////

  let ssh = new NodeSSH();
  _notify("connect");
  return ssh
    .connect(options.ssh)
    .then(() => {
      return ssh.putFile(options.srcFilepath, options.destFilepath,null,{
        'step' : progressHandler
      });
    })
    .then(() => {
      if( runRemoteScript ) {
        _notify("upload-installer");
        return ssh.putFile(runRemoteScript.srcFilepath, runRemoteScript.destFilepath,null,{
          'step' : progressHandler
        })
        .then( () => {
          let cmdSetScriptPermission = `chmod u=rwx "${runRemoteScript.destFilepath}"`;
          return ssh.execCommand(cmdSetScriptPermission,[],{stream: 'stdout'})
          .then( cmdResultHandler );
        })
        .then( () => {
          return ssh.exec(runRemoteScript.destFilepath, runRemoteScript.arg,{stream: 'both'})
          .then( cmdResultHandler );
        })
        .then( () => {
          return ssh.execCommand(`rm "${runRemoteScript.destFilepath}"`,[],{stream: 'stdout'})
          .then( cmdResultHandler );

        });
      } else {
        return true;
      }
    })
    .then(() => {
      ssh.dispose();
      _notify("success");
    })
    .catch(err => {
      console.error('deployByScript',err);
      ssh.dispose();
      _notify("error", err );
      throw new Error(err);
    }
  );
};

exports.run_orig = function(options,notify) {
  console.log('deploy-ssh-script : ',options);

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

  let progressHandler = function(total_transferred, chunk, total) {
    let percent = Math.floor((total_transferred / total) * 100);
    console.log(percent);
    sendNotification(`upload local file from ${options.srcFilepath} to remote ${options.destFilepath}`,{
      "operation" : "upload",
      "percent" : percent
    });
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
      'step' : progressHandler
    });
  })
  .then(() => ssh.dispose())
  .catch(err => {
    console.error('deployByScript',err);
    ssh.dispose();
    throw new Error(err);
  });
};
