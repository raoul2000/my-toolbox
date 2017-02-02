"use strict";
const ipcRenderer = require('electron').ipcRenderer;

// for test only
document.getElementById('btn-test-winnmerge').addEventListener('click',function(event){
  ipcRenderer.send('compareExternal.start');
});
/**
 * Start the comparaison
 */
const btn_start = document.getElementById('btn-start');

btn_start.addEventListener('click',function(event){

  console.log("btn_start click");
  // get form values
  // clear existing progress messages
  const srcHost     = document.getElementById('src-host').value;
  const srcUsername = document.getElementById('src-username').value;
  const srcPassword = document.getElementById('src-password').value;

  const trgHost     = document.getElementById('trg-host').value;
  const trgUsername = document.getElementById('trg-username').value;
  const trgPassword = document.getElementById('trg-password').value;

  const folderPath = document.getElementById('folder-path').value;
  // TODO : validate user input

  showView(VIEW.NONE);

  const arg = {
    "src" : {
      "connection" : {
        "host" : srcHost,
        "username" : srcUsername,
        "password" : srcPassword
      },
      "folderPath" : "/mnt/c/dev/ws/lab/my-toolbox/test/data/fs1" // folderPath // source folder to compare
    },
    "trg" : {
      "connection" :  {
        "host" : trgHost,
        "username" : trgUsername,
        "password" : trgPassword
      },
      "folderPath" : "/mnt/c/dev/ws/lab/my-toolbox/test/data/fs2" // folderPath // target folder to compare
    }
  };

  compareCtx.arg = arg;
  // clean progress
  var progressMessage = document.getElementById("progress-message")
  while(progressMessage.firstChild) {
    progressMessage.removeChild(progressMessage.firstChild);
  }
  showView(VIEW.PROGRESS);

  console.log('sending ...');
  console.log(arg);

  ipcRenderer.send('remoteCompare.start',arg);
});
