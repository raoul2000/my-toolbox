"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const config = require('../../config').config;
const path = require('path');
const ssh = require('../node/deploy-ssh');

function sequentialSSHDeploy(arg, event) {
  console.log("sequentialSSHDeploy");
  let fileFolderPath = config.get('nexus.downloadFolder');

  let deploy = function(files) {
    let p = Promise.resolve();
    files.forEach( (file) => {
      p = p.then( result => {
        var srcFilepath = path.posix.join(fileFolderPath,file.basename);
        let destFilepath = path.posix.join(arg.targetPath, file.installFolder, file.basename);
        let symlinkPath = path.posix.join(arg.targetPath, file.symlink);

        return ssh.deployStandard({
          'ssh': arg.ssh ,
          'srcFilepath'  : srcFilepath,
          'destFilepath' : destFilepath,
          'symlinkPath'  : symlinkPath
        }, function(progressMessage, info){
          console.log(progressMessage);
          event.sender.send('nx-ssh-deploy.progress', {
            "file" : file,
            "progressMessage" : progressMessage,
            "info" : info
          });
        })
        .then( x => {
          console.log('nx-ssh-deploy.done', file);
          event.sender.send('nx-ssh-deploy.done', file);
        })
        .catch( err => {
          console.log('nx-ssh-deploy.error', file, err);
          event.sender.send('nx-ssh-deploy.error', {"file" : file, "error" : err});
        });
      });
    });
    return p;
  };
  return deploy(arg.files);
}

function parallelSSHDeploy(arg, event) {
  console.log("parallelSSHDeploy");
  let fileFolderPath = config.get('nexus.downloadFolder');

  let tasks = arg.files.map( file => {

    var srcFilepath = path.posix.join(fileFolderPath,file.basename);
    let destFilepath = path.posix.join(arg.targetPath, file.installFolder, file.basename);
    let symlinkPath = path.posix.join(arg.targetPath, file.symlink);

    return ssh.deployStandard({
      'ssh': arg.ssh ,
      'srcFilepath'  : srcFilepath,
      'destFilepath' : destFilepath,
      'symlinkPath'  : symlinkPath
    }, function(progressMessage, info){
      event.sender.send('nx-ssh-deploy.progress', {
        "file" : file,
        "progressMessage" : progressMessage,
        "info" : info
      });
    })
    .then( x => {
      console.log('nx-ssh-deploy.done', file);
      event.sender.send('nx-ssh-deploy.done', file);
    })
    .catch( err => {
      console.log('nx-ssh-deploy.error', file, err);
      event.sender.send('nx-ssh-deploy.error', {"file" : file, "error" : err});
    });
  });
  return Promise.all(tasks);
}
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
  //sequentialSSHDeploy(arg, event);
  parallelSSHDeploy(arg,event);
  return;
});
