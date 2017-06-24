"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const config = require('../../config').config;
const fs = require('fs-extra');
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
  return;
  let fileFolderPath = config.get('nexus.downloadFolder');

  // create Deployment folder from the configured download folder + deployment ID
  let deploymentFolderPath = path.join(fileFolderPath, arg.deployId);
  let playbookFilePath     = path.join(deploymentFolderPath, 'playbook.yaml');
  console.log("deploymentFolderPath", deploymentFolderPath);

  //create the playbook object
});
