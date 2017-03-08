"use strict";
const ipcRenderer = require('electron').ipcRenderer;



/**
 * Manage the  initialization form where the user enters :
 * - source connection parameters
 * - target connection parameters
 * - remote folder to compare
 */

var submitForm = function(){

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

    app.showView(app.VIEW.NONE);

    app.ctx = {
      "src" : {
        "connection" : {
          "host"     : srcHost,
          "username" : srcUsername,
          "password" : srcPassword
        },
        //"folderPath" : "/mnt/c/dev/ws/lab/my-toolbox/test/data/fs1" // folderPath // source folder to compare
        "folderPath" : folderPath
      },
      "trg" : {
        "connection" :  {
          "host"     : trgHost,
          "username" : trgUsername,
          "password" : trgPassword
        },
        "folderPath" : "/mnt/c/dev/ws/lab/my-toolbox/test/data/fs2" // folderPath // target folder to compare
        //"folderPath" : folderPath
      }
    };
    app.progress.start();
    ipcRenderer.send('remoteCompare.start',app.ctx);
};

ipcRenderer.on('remoteCompare.progress',function(event,progress){
  var msg = "";
  switch(progress.task) {
    case "read-source-start": msg = "reading source file";
    break;
    case "read-source-end": msg = "source file found : "+progress.count;
    break;
    case "read-target-start": msg = "Reading Target file ";
    break;
    case "read-target-end": msg = "Target file found : "+progress.count;
    break;
  }
  app.progress.message(msg);
});

ipcRenderer.on('remoteCompare.error',function(event,err){
  console.log(event);
  console.error(err);
  app.error.show('Error','failed to read remote files');
  app.showView(app.VIEW.FORM);
});

/**
 * Start the comparaison
 */
document.getElementById('btn-start').addEventListener('click',submitForm);
