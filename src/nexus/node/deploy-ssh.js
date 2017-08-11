"use strict";

var fs = require('fs');
var path = require('path');
const yaml = require('js-yaml');
const NodeSSH = require('node-ssh');

let cmdResultHandler = function(result) {
  if( result.code !== 0) {
    console.error(JSON.stringify(result));
    throw new Error(result);
  } else {
    console.log("stdout", result.stdout);
    return result;
  }
};

function execCommand(ssh, command, options, notify ) {

  return function(prevResult) {
    console.log("prevResult = ",prevResult);
    options = options || [];
    if(notify) {
      notify(command);
    }
    return ssh.execCommand(command,options).then( cmdResultHandler );
  };
}

function exec(ssh, command, args, options, notify ) {
  return function(prevResult) {
    args = args || [];
    options = options || {};
    if(notify) {
      notify(command);
    }
    return ssh.exec(command,args,options).then( cmdResultHandler );
  };
}

function putFile(ssh, srcFilepath, destFilepath, notify) {
  return function(prevResult) {
    return ssh.putFile(srcFilepath, destFilepath,null,{
      'step' : function(total_transferred, chunk, total) {
        let percent = Math.floor((total_transferred / total) * 100);
        if(notify) {
          notify(`upload local file from ${srcFilepath} to remote ${destFilepath}`,{
          "operation" : "upload",
          "percent" : percent
          });
        }
      }
    });
  };
}

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
exports.deployType1 = function(options, notify) {

  if(notify && typeof notify !== 'function') {
    return Promise.reject(new Error("argument notify must be a function"));
  }

  let ssh = new NodeSSH();

  let remoteFiletitle = path.basename(options.destFilepath);
  let remoteInstallFolderpath = path.dirname(options.destFilepath); //  /remote/folder/mod-1.3.3

  let symLinkRelativeName = path.basename(options.symlinkPath); //  mod
  let symlinkTargetRelative = path.basename(remoteInstallFolderpath); // mod-1.3.3

  //let cmdUncompress = `cd ${remoteInstallFolderpath} && jar -xvf "${remoteFiletitle}"`;
  let cmdCheckInstallFolderNotExist = `test ! -d "${remoteInstallFolderpath}"`;
  let cmdCreateInstallFolder = `mkdir "${remoteInstallFolderpath}"`;
  // upload
  let cmdUncompress = `cd "${remoteInstallFolderpath}" && tar -xvf "${remoteFiletitle}"`;
  let cmdCopySrc = `cd "${remoteInstallFolderpath}" && cp -rva ./swing-tomcat-*-standalone/swing/* .`;
  let cmdBackupLib = `cd "${remoteInstallFolderpath}" && mv "../lib/swing/embaselib" "../lib/swing/embaselib.$(date +%Y%m%d-%H%M%S)"	`;
  let cmdUpdateLib = `cd "${remoteInstallFolderpath}" && cp  -rva "./embaselib" "../lib/swing"`;
  //let cmdUpdateSymlink = `ln -sfn "${remoteInstallFolderpath}" "${options.symlinkPath}"`;
  let cmdUpdateSymlink = `cd "${remoteInstallFolderpath}/.." && ln -sfn "${symlinkTargetRelative}" "${symLinkRelativeName}"`;
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
      console.error(JSON.stringify(result));
      throw new Error(result);
    } else {
      console.log("stdout", result.stdout);
    }
  };

  return ssh.connect(options.ssh)
  .then( execCommand(ssh, "ls -rtl",null, sendNotification))
  .then( execCommand(ssh, "ps",null, sendNotification))
  //.then( putFile(ssh,options.srcFilepath , options.destFilepath, sendNotification))
  //.then( exec(ssh, "ls", ['-rtl'], {stream : 'both'}, sendNotification))
  .then(() => ssh.dispose())
  .catch(err => {
    console.error(err);
    ssh.dispose();
    throw new Error(err);
  });

  // start the Promise chain
  sendNotification(`connecting to ${options.ssh.host}`);
  return ssh
  .connect(options.ssh)
  /*
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
  })*/
  .then(() => {
    sendNotification(`copy sources : ${cmdCopySrc}`);
    return ssh.execCommand(cmdCopySrc,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`backup lib : ${cmdBackupLib}`);
    return ssh.execCommand(cmdBackupLib,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`update lib : ${cmdUpdateLib}`);
    return ssh.execCommand(cmdUpdateLib,[],{stream: 'stdout'}).then( cmdResultHandler );
  })
  .then(() => {
    sendNotification(`update symlink : ${cmdUpdateSymlink}`);
    return ssh.execCommand(cmdUpdateSymlink,[],{stream: 'stdout'}).then( cmdResultHandler );
  })

  .then(() => ssh.dispose())
  .catch(err => {
    console.error('deployStandard',err);
    ssh.dispose();
    throw new Error(err);
  });
  /*
  .then(() => {
    sendNotification(`delete uploaded file : ${cmdDeleteUploadedFile}`);
    return ssh.execCommand(cmdDeleteUploadedFile,[],{stream: 'stdout'}).then( cmdResultHandler );
  })*/
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

  let symLinkRelativeName = path.basename(options.symlinkPath); //  mod
  let symlinkTargetRelative = path.basename(remoteInstallFolderpath); // mod-1.3.3

  //let cmdUncompress = `cd ${remoteInstallFolderpath} && jar -xvf "${remoteFiletitle}"`;
  let cmdCheckInstallFolderNotExist = `test ! -d "${remoteInstallFolderpath}"`;
  let cmdCreateInstallFolder = `mkdir "${remoteInstallFolderpath}"`;
  let cmdUncompress = `cd "${remoteInstallFolderpath}" && unzip -qo "${remoteFiletitle}"`;
  //let cmdUpdateSymlink = `ln -sfn "${remoteInstallFolderpath}" "${options.symlinkPath}"`;
  let cmdUpdateSymlink = `cd "${remoteInstallFolderpath}/.." && ln -sfn "${symlinkTargetRelative}" "${symLinkRelativeName}"`;

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
