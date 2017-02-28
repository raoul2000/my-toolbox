"use strict";
const electron = require('electron');
const ipcMain  = electron.ipcMain;
const sftp     = require('../node/sftp.js');
const Q = require('q');
//const fs = require('fs');

ipcMain.on('putLocalFilePair.start', function(event, arg) {
  console.log('putLocalFilePair.start : ');
  console.log(arg);

  var putLocalFile = function(event, itemRole) {
    event.sender.send('putLocalFilePair.progress', itemRole.remoteFilepath);
    console.log('putLocalFile : '+itemRole.remoteFilepath);
    return sftp.put(itemRole.connection, itemRole.localFilepath, itemRole.remoteFilepath)
      .then(function(result){
        event.sender.send('putLocalFilePair.progress', itemRole.remoteFilepath + " : done");
        itemRole.modified = false;
      });
  };

  var promises = [];
  if(arg.src.modified ) {
    promises.push(putLocalFile(event, arg.src));
  }

  if(arg.trg.modified ) {
    promises.push(putLocalFile(event, arg.trg));
  }

  Q.allSettled(promises)
  .then(function(results){
    console.log(results);
    event.sender.send('putLocalFilePair.end');
  })
  .catch(function(error){
    console.error(error);
    event.sender.send('putLocalFilePair.error');
  });
});
