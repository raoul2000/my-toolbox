"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const config = require('../../config').config;
const path = require('path');
const ssh = require('../node/deploy-ssh');

// starting SSH deploy
/* {
    'ssh' : {
      'host' : hostname,
      'port' : port,
      'username' : username,
      'password' : password
    },
    'targetPath' : targetPath,
  'files': [{
    basename: 'emCheckin-2.4.1.war',
    installFolder: 'checkin-2.4.1',
    symlink: 'checkin',
    version: '2.4.1'
  }...]
  }
  */
ipcMain.on('nx-ssh-deploy.start', function(event, arg) {
  console.log('nx-ssh-deploy.start', arg);
  let fileFolderPath = config.get('nexus.downloadFolder');

  let tasks = arg.files.map( file => {

    var srcFilepath = path.posix.join(fileFolderPath,file.basename);
    let destFilepath = path.posix.join(arg.targetPath, file.installFolder, file.basename);
    let symlinkPath = path.posix.join(arg.targetPath, file.symlink);

    return ssh.deployStandard({
      'ssh': arg.ssh ,
      'srcFilepath': srcFilepath,
      'destFilepath': destFilepath,
      'symlinkPath': symlinkPath
    });
  });
  return Promise.all(tasks);
});
