"use strict";
const electron = require('electron');
const ipcMain  = electron.ipcMain;
const child_process   = require('child_process');
const fs = require('fs');

ipcMain.on('merge.start',function(event,arg){
  console.log("## merge.start");
  console.log(arg);

  var leftFilename  = arg.ctx.src.localFilepath;
  var rightFilename = arg.ctx.trg.localFilepath;

  var lmtime = fs.statSync(leftFilename ).mtime.getTime();
  var rmtime = fs.statSync(rightFilename).mtime.getTime();

  // prepare external merge application command line argument
  var cmdArg = arg.diffTool.arg.map(function(item){
    return item.replace("${SOURCE}", leftFilename)
      .replace("${TARGET}",rightFilename);
  });

  child_process.execFileSync(
    arg.diffTool.program,
    cmdArg
  );
  console.log("end of external merge tools ----");

  var filesMatch = fs.readFileSync(leftFilename, 'utf8') === fs.readFileSync(rightFilename,'utf8');

  // merge done. Check if changes have been done on left and right files
  console.log("#merge.end");
  console.log(arg);

  event.sender.send('merge.end',  {
    "srcModified" : lmtime !== fs.statSync(leftFilename).mtime.getTime(),
    "trgModified" : rmtime !== fs.statSync(rightFilename).mtime.getTime(),
    "filesMatch"  : filesMatch
  });

});
