"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const config = require('../../config').config;
const fs = require('fs');
const path = require('path');
const ansible = require('../node/ansible');


// starting playbook creation
ipcMain.on('nx-create-playbook.start',function(event, arg){
  console.log('nx-create-playbook.start',arg);

  // create Deployment folder
  let deploymentFolderPath = path.join(
    config.get('nexus.downloadFolder'),
    arg.deployId
  );
  if( fs.exists(deploymentFolderPath)) {
    event.sender.send('nx-load-artefact-list.error', { "message" : "A deployment folder with the same name already exists"});
    return;
  }
  fs.mkdirSync(deploymentFolderPath);


  // copy selected files to deployment folder
  // create ansible playbook
  // save ansible playbook to deployment folder
  // done.

  ansible.create(config.get('nexus.downloadFolder'))
  .then( result => {
    console.log(result);
    event.sender.send('nx-load-artefact-list.done', result);
  })
  .catch( error => {
    event.sender.send('nx-load-artefact-list.error', error);
  });
});
