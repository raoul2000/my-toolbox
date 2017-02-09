"use strict";
const electron = require('electron');
const ipcMain  = electron.ipcMain;
const compare  = require('../node/md5-compare.js');
const sftp     = require('../node/sftp.js');
const child_process   = require('child_process');
const fs = require('fs');

/**
 * PUT a local file to a remote server.
 *
 * arg = {
 *  connection : {}
 *  localFilepath : "",
 *  remoteFilepath : "",
 *  updateContent : true | false
 * }
 */
ipcMain.on('putLocalFile.start', function(event, arg) {

  if( arg.updateContent === true) {
    fs.writeFileSync(arg.localFilepath, arg.fileContent, 'utf8');
  }

  sftp.put(arg.connection, arg.localFilepath,  arg.remoteFilepath)
  .then(function(result){
    event.sender.send('putLocalFile.end');
  })
  .catch(function(error){
    event.sender.send('putLocalFile.error', error);
  });

});

/**
 * arg : {
 *  src : {
 *    connection : {..},
 *    localFilepath : "/folder/file.txt",
 *    remoteFilepath : "/mnt/folder/file.txt"
 *
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
  event.sender.send('getRemoteFilePair.progress',"loading source file");

  sftp.get(arg.src.connection, arg.src.remoteFilepath, arg.src.localFilepath)
  .then(function(result){
    content.src = fs.readFileSync(arg.src.localFilepath,'utf8');
    event.sender.send('getRemoteFilePair.progress',"loading target file");
    return sftp.get(arg.trg.connection, arg.trg.remoteFilepath, arg.trg.localFilepath);
  })
  .then(function(result){
    content.trg = fs.readFileSync(arg.trg.localFilepath, 'utf8');
    event.sender.send('getRemoteFilePair.progress',"done");
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
    event.sender.send('remoteCompare.progress', { // progress notification
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
      event.sender.send('remoteCompare.progress', { // progress notification
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
  console.log(arg);

  // prepare external diffTool command line argument
  var cmdArg = arg.diffTool.arg.map(function(item){
    return item.replace("${SOURCE}", arg.leftFile)
      .replace("${TARGET}",arg.rightFile);
  });

  child_process.execFileSync(
    arg.diffTool.program,
    cmdArg
  );


  console.log("end of winmerge");
});
