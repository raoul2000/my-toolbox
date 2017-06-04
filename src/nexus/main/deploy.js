"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const config = require('../../config').config;
const fs = require('fs');
const path = require('path');
const artefact = require('../node/artefact');


ipcMain.on('nx-open-folder',function(event){
  electron.shell.openItem(config.get('nexus.downloadFolder'));
});

ipcMain.on('nx-load-artefact-list.start',function(event){
  console.log('nx-load-artefact-list.start');

  artefact.buildListFromLocalFolder(config.get('nexus.downloadFolder'))
  .then( result => {
    console.log(result);
    event.sender.send('nx-load-artefact-list.done', result);
  })
  .catch( error => {
    event.sender.send('nx-load-artefact-list.error', error);
  });
});


ipcMain.on('nx-update-artefact-meta.start',function(event, data){
  console.log('nx-update-artefact-meta.start');
  // {
  //  "basename" : basename,
  //  "metadata" : {...}
  // }
  let metadataFilePath = path.join(
    config.get('nexus.downloadFolder'),
    data.basename.concat('.meta')
  );
  artefact.saveMetadata(metadataFilePath, data.metadata)
  .then( result => {
    console.log(result);
    event.sender.send('nx-update-artefact-meta.done', result);
  })
  .catch( error => {
    event.sender.send('nx-update-artefact-meta.error', error);
  });
});
