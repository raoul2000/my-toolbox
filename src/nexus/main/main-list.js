"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const nexusAPI = require('../node/nexus-api');
const nexusDownloader = require('../node/nexus-downloader');

let download = {

};


function extractVersion(info) {
  if (info.data && Array.isArray(info.data)) {
    return info.data.filter(function(item) {
      return item.leaf === false;
    }).map(function(item) {
      return item.text;
    });
  } else {
    return [];
  }
}

ipcMain.on('nx-fetch-version.start', function(event, arg) {
  console.log(arg);

  nexusAPI.fetchModuleVersion({
    "id": "m1",
    "url": {
      "release": "http://localhost:3000/m1Release",
      "snapshot": "http://localhost:3000/m1Snapshot"
    }
  }).then(function(result) {
    arg.version = {
      release: extractVersion(result.release),
      snapshot: extractVersion(result.snapshot)
    };
    event.sender.send('nx-fetch-version.done', arg);
  });
});



ipcMain.on('nx-download-mod.cancel', function(event, arg) {
  console.log('#### nx-download-mod.cancel');
  console.log(arg);

  download[arg.moduleId] = {
    state : "cancel",
  };
  console.log("download : ");
  console.log(download);
});


ipcMain.on('nx-download-mod.start', function(event, arg) {
  console.log("nx-download-mod.start");
  console.log(arg);

  download[arg.moduleId] = {
    state : "start",
  };
  var downloadContinue = function(modId) {
    return function() {
      console.log("conContinue : modId = "+modId);
      console.log(download);
      if( download.hasOwnProperty(modId) && download[modId].state === 'cancel') {
        console.log('FALSE');
        return false;
      } else {
        console.log('TRUE');
        return true;
      }
    };
  };
  let urlTest = 'https://github.com/raoul2000/my-toolbox/archive/master.zip';
  //let urlTest = 'https://download.docker.com/win/stable/InstallDocker.msi';

  nexusDownloader.download(
    urlTest,
    'd:\\tmp\\file.zip',
    downloadContinue(arg.moduleId)
    )
    .then(function(result) {
      download[arg.moduleId] = {state : "done" }; // update download state
      event.sender.send('nx-download-mod.done', {
        moduleId : arg.moduleId
      });
    }, function(error) {
      download[arg.moduleId] = { state : "error" };  // update download state
      event.sender.send('nx-download-mod.error', {
        moduleId : arg.moduleId,
        error : error
      });
    }, function(progress) {
      console.log(progress);
      download[arg.moduleId] = { state : "progress" };  // update download state
      event.sender.send('nx-download-mod.progress', {
        moduleId : arg.moduleId,
        progress : progress
      });
    });

});
