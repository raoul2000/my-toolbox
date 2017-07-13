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
/*
data = [ { basename: 'emAdorder-2.0.0.war',
    installFolder: 'aaaa',
    symlink: 'qsd',
    version: 'aaa' } ]
*/
ipcMain.on('nx-delete-files.start',function(event,data){
  console.log('nx-delete-files.start',data);
  let folderPath = config.get('nexus.downloadFolder');
  data.forEach( item => {
    let warFilePath = path.join(folderPath,item.basename);
    let metaFilePath = warFilePath.concat('.meta');
    console.log("deleting file ", warFilePath);
    fs.unlinkSync(warFilePath);
    
    console.log("deleting file ", metaFilePath);
    fs.unlinkSync(metaFilePath);
    event.sender.send('nx-delete-files.done');
  });
});
