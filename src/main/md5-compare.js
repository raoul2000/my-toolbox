"use strict";
const electron = require('electron');
const ipcMain  = electron.ipcMain;
const compare  = require('../node/md5-compare.js');
const sftp     = require('../node/sftp.js');
const cache    = require('../node/cache.js');
const child_process   = require('child_process');
const Q = require('q');
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
  console.log("## putLocalFile.start");
  console.log(arg);

  if( arg.updateContent === true) {
    fs.writeFileSync(arg.localFilepath, arg.fileContent, 'utf8');
  }

  sftp.put(arg.connection, arg.localFilepath,  arg.remoteFilepath)
  .then(function(result){
    event.sender.send('putLocalFile.end', arg);
  })
  .catch(function(error){
    event.sender.send('putLocalFile.error', arg, error);
  });

});


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
  console.log("## compareExternal.start");
  console.log(arg);

  var leftFilename  = arg.ctx.src.localFilepath;
  var rightFilename = arg.ctx.trg.localFilepath;

  var lmtime = fs.statSync(leftFilename ).mtime.getTime();
  var rmtime = fs.statSync(rightFilename).mtime.getTime();

  // prepare external diffTool command line argument
  var cmdArg = arg.diffTool.arg.map(function(item){
    return item.replace("${SOURCE}", leftFilename)
      .replace("${TARGET}",rightFilename);
  });

  child_process.execFileSync(
    arg.diffTool.program,
    cmdArg
  );
  console.log("end of external compare tools ----");

  var filesMatch = fs.readFileSync(leftFilename, 'utf8') === fs.readFileSync(rightFilename,'utf8');

  // merge done. Check if changes have been done on left and right files
  console.log("#compareExternal.end");
  console.log(arg);

  event.sender.send('compareExternal.end',  {
    "srcModified" : lmtime !== fs.statSync(leftFilename).mtime.getTime(),
    "trgModified" : rmtime !== fs.statSync(rightFilename).mtime.getTime(),
    "filesMatch"  : filesMatch
  });

});
