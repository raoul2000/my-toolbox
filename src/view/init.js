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

    app.compareCtx.arg = {
      "src" : {
        "connection" : {
          "host"     : srcHost,
          "username" : srcUsername,
          "password" : srcPassword
        },
        "folderPath" : "/mnt/c/dev/ws/lab/my-toolbox/test/data/fs1" // folderPath // source folder to compare
        //"folderPath" : folderPath
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

    console.log('sending ...');
    console.log(app.compareCtx.arg);

    app.progress.start();
    ipcRenderer.send('remoteCompare.start',app.compareCtx.arg);
};

/**
 * Start the comparaison
 */
document.getElementById('btn-start').addEventListener('click',submitForm);
