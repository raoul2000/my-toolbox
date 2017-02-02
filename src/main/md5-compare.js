"use strict";
const electron = require('electron');
const ipcMain  = electron.ipcMain;
const compare  = require('../node/md5-compare.js');
const sftp     = require('../node/sftp.js');
const child_process   = require('child_process');
const fs = require('fs');

/**
 * arg : {
 *  src : {
 *    connection : {..}
 *  }
 * }
 */
ipcMain.on('getRemoteFilePair.start', function(event, arg){
  console.log('getRemoteFilePair.start : ');
  console.log(arg);
  var content = {
    "src" : null,
    "trg" : null
  };
  sftp.get(arg.src.connection, arg.src.remoteFilepath, arg.src.localFilepath)
  .then(function(result){
    content.src = fs.readFileSync(arg.src.localFilepath,'utf8');
    return sftp.get(arg.trg.connection, arg.trg.remoteFilepath, arg.trg.localFilepath);
  })
  .then(function(result){
    content.trg = fs.readFileSync(arg.trg.localFilepath, 'utf8');
    event.sender.send('getRemoteFilePair.end', content);
  })
  .catch(function(error){
    event.sender.send('getRemoteFilePair.error',error);
  });
});


ipcMain.on('getRemoteFileSrc.start',function(event,arg){
  console.log('getRemoteFileSrc.start : '+arg.remoteFilepath+" to " + arg.localFilepath);
  sftp.get(arg.connection, arg.remoteFilepath, arg.localFilepath)
  .then(function(result){
    event.sender.send('getRemoteFileSrc.end');
  })
  .catch(function(error){
    console.error(error);
    event.sender.send('getRemoteFileSrc.error',error);
  });
});

ipcMain.on('getRemoteFileTrg.start',function(event,arg){
  console.log('getRemoteFileTrg.start : '+arg.remoteFilepath+" to " + arg.localFilepath);
  sftp.get(arg.connection, arg.remoteFilepath, arg.localFilepath)
  .then(function(result){
    event.sender.send('getRemoteFileTrg.end');
  })
  .catch(function(error){
    console.error(error);
    event.sender.send('getRemoteFileTrg.error',error);
  });
});

/**
 * Compare Start
 */
ipcMain.on('remoteCompare.start',function(event,arg){
  console.log(event);

  event.sender.send('remoteCompare.progress', {
    "task" : "read-source-start"
  });

   compare.md5Folder(arg.src.connection,arg.src.folderPath)
  .then(function(srcResult){
    event.sender.send('remoteCompare.progress', {
      "task" : "read-source-end",
      "count" : srcResult.length}
    );
    console.log("SOURCE ======");
    console.log(srcResult);

    event.sender.send('remoteCompare.progress', {
      "task" : "read-target-start"
    });

    return compare.md5Folder(arg.trg.connection,arg.trg.folderPath)
    .then(function(trgResult){
      event.sender.send('remoteCompare.progress', {
        "task" : "read-target-end",
        "count" : trgResult.length
      })
      ;
      console.log("TARGET ======");
      console.log(trgResult);
      // DEBUG
      // this is to simulate 2 remote servers
      srcResult.forEach(function(item){
        item.path = item.path.replace(/fs1/,"FS");
      });
      trgResult.forEach(function(item){
        item.path = item.path.replace(/fs2/,"FS");
      });
      // END  DEBUG
      var final = compare.diff(srcResult,trgResult);
      event.sender.send('remoteCompare.done', final );
    })
    .fail(function(error){
      event.sender.send('remoteCompare.error', error);
    });
  })
  .fail(function(error){
    console.error(error);
    event.sender.send('remoteCompare.error', error);
  });
});

ipcMain.on('compareExternal.start',function(event,arg){
  //child_process.execSync('"C:/Program Files (x86)/WinMerge/WinMergeU.exe "',
  //['"c:/tmp/srcf1.txt"', '"c:/tmp/trgf1.txt"']);
  child_process.execSync('"C:/Program Files (x86)/WinMerge/WinMergeU.exe " "c:/tmp/srcf1.txt" "c:/tmp/trgf1.txt"');

console.log("end of winmerge");
});
