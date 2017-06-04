"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const config = require('../../config').config;
const fs = require('fs');
const path = require('path');
const artefact = require('../node/artefact');

// toolbar button : open download folder
ipcMain.on('nx-open-folder',function(event){
  electron.shell.openItem(config.get('nexus.downloadFolder'));
});

// starting to load artefact list from disk (download folder)
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

// updates/create a metadata file for a given artefact
ipcMain.on('nx-update-artefact-meta.start',function(event, data){
  console.log('nx-update-artefact-meta.start',data);
  // data = {
  //  "basename" : basename,
  //  "metadata" : {...}
  // }
  let metadataFilePath = path.join(
    config.get('nexus.downloadFolder'),
    data.basename.concat('.meta')
  );
  // create or update file
  artefact.saveMetadata(metadataFilePath, data.metadata)
  .then( result => {
    console.log(result);
    event.sender.send('nx-update-artefact-meta.done', result);
  })
  .catch( error => {
    event.sender.send('nx-update-artefact-meta.error', error);
  });
});
