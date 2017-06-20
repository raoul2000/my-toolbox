"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const config = require('../../config').config;
const fs = require('fs-extra');
const path = require('path');
const ansible = require('../node/deploy-ansible');


// starting playbook creation
/* {
  'files': [{
    basename: 'emCheckin-2.4.1.war',
    installFolder: 'checkin-2.4.1',
    symlink: 'checkin',
    version: '2.4.1'
  }...],
  'hostname': hostname,
  'deployId': deployId,
  'remoteInstallBasePath' : '/path/to/base/install'
  }
  */
ipcMain.on('nx-create-playbook.start', function(event, arg) {
  console.log('nx-create-playbook.start', arg);

  let fileFolderPath = config.get('nexus.downloadFolder');

  // create Deployment folder from the configured download folder + deployment ID
  let deploymentFolderPath = path.join(fileFolderPath, arg.deployId);
  let playbookFilePath     = path.join(deploymentFolderPath, 'playbook.yaml');
  console.log("deploymentFolderPath", deploymentFolderPath);

  //create the playbook object
  let playbook = ansible.createPlaybook(arg.hostname);

  // if folder exists it is emptied, if not it is created
  fs.emptyDir(deploymentFolderPath)
    .then(() => {

      // for each file :
      // - copy to deploymentFolderPath
      // - add ansible task to the playbook

      let copyAllFiles = arg.files.map(file => {
        let srcFile  = path.join(fileFolderPath, file.basename);
        let destFile = path.join(deploymentFolderPath, file.basename);
        console.log("src  : ", srcFile);
        console.log("dest : ", destFile);
        playbook.tasks = playbook.tasks.concat(
          ansible.createFileDeploymentTasks(file,arg.remoteInstallBasePath)
        );
        return fs
        .copy(srcFile, destFile)
        .catch(err => {
          console.error("failed to copy file", err);
          event.sender.send('nx-create-playbook.error', err);
        });
      });
      return Promise.all(copyAllFiles);
    })
    .then( () => {
      // when all files have been copied, save the playbook
      ansible.savePlaybook(playbook, playbookFilePath);
      event.sender.send('nx-create-playbook.done', playbookFilePath);
      return true;
    })
    .catch(err => {
      console.log(err);
      event.sender.send('nx-create-playbook.error', err);
    });
});
