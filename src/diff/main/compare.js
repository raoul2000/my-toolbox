"use strict";
const electron = require('electron');
const ipcMain  = electron.ipcMain;
const compare  = require('../node/md5-compare.js');

/**
 * Compare Start
 */
ipcMain.on('remoteCompare.start',function(event,arg){
  console.log(arg);

  event.sender.send('remoteCompare.progress', {
    "task" : "read-source-start"
  });

   compare.md5Folder(arg.src.connection,arg.src.folderPath, arg.options)
  .then(function(srcResult){
    event.sender.send('remoteCompare.progress', { // progress notification
      "task" : "read-source-end",
      "count" : srcResult.length}
    );

    console.log("SOURCE ======");
    console.log(srcResult);
    /*
    if(srcResult.error ) {
      event.sender.send('remoteCompare.error', srcResult);
    }
    */
    event.sender.send('remoteCompare.progress', {
      "task" : "read-target-start"
    });

    return compare.md5Folder(arg.trg.connection,arg.trg.folderPath, arg.options)
    .then(function(trgResult){
      event.sender.send('remoteCompare.progress', { // progress notification
        "task" : "read-target-end",
        "count" : trgResult.length
      })
      ;
      console.log("TARGET ======");
      console.log(trgResult);
      if( false ) {
        // DEBUG
        // this is to simulate 2 remote servers
        srcResult.forEach(function(item){
          item.path = item.path.replace(/fs1/,"FS");
        });
        trgResult.forEach(function(item){
          item.path = item.path.replace(/fs2/,"FS");
        });
        // END  DEBUG
        //
      }

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
