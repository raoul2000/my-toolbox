"use strict";
const electron = require('electron');
const ipcMain  = electron.ipcMain;
const sftp     = require('../node/sftp.js');
const cache    = require('../node/cache.js');
const fs       = require('fs');

/**
 * arg : {
 *  src : {
 *    connection : {
 *      host : "",
 *      username : ""
 *    },
 *    remoteFilepath : "/mnt/folder/file.txt"
 *  },
 *  trg : ...
 * }
 */
ipcMain.on('getRemoteFilePair.start', function(event, arg){
  console.log('getRemoteFilePair.start : ');
  console.log(arg);

  try {
    var ResultfilePair = {
      'src' : {
        'localFilepath' : cache.createTmpLocalFile(arg.src.connection, arg.src.remoteFilepath, "c:\\tmp\\cache"),
        'content' : null
      },
      'trg' : {
        'localFilepath' : cache.createTmpLocalFile(arg.trg.connection, arg.trg.remoteFilepath, "c:\\tmp\\cache"),
        'content' : null
      }
    };

    event.sender.send('getRemoteFilePair.progress',"loading source file");

    sftp.get(arg.src.connection, arg.src.remoteFilepath, ResultfilePair.src.localFilepath)
    .then(function(result){
      ResultfilePair.src.content = fs.readFileSync(ResultfilePair.src.localFilepath,'utf8');
      event.sender.send('getRemoteFilePair.progress',"loading target file");
      return sftp.get(arg.trg.connection, arg.trg.remoteFilepath, ResultfilePair.trg.localFilepath);
    })
    .then(function(result){
      ResultfilePair.trg.content = fs.readFileSync(ResultfilePair.trg.localFilepath, 'utf8');
      event.sender.send('getRemoteFilePair.progress',"done");
      event.sender.send('getRemoteFilePair.end', ResultfilePair);
    })
    .catch(function(error){
      event.sender.send('getRemoteFilePair.error',error);
    });

  } catch (err) {
    event.sender.send('getRemoteFilePair.error',err);
  }
});
