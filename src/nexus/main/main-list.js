"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const nexusAPI = require('../node/nexus-api');
const nexusDownloader = require('../node/nexus-downloader');

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


ipcMain.on('nx-download-mod.start', function(event, arg) {
  console.log("nx-download-mod.start");
  console.log(arg);
  nexusDownloader.download(
    'https://download.docker.com/win/stable/InstallDocker.msi',
    'd:\\tmp\\file.zip'
    )
    .then(function(result) {
      event.sender.send('nx-download-mod.done', {
        moduleId : arg.moduleId
      });
    }, function(error) {
      event.sender.send('nx-download-mod.error', {
        moduleId : arg.moduleId,
        error : error
      });
    }, function(progress) {
      console.log(progress);
      event.sender.send('nx-download-mod.progress', {
        moduleId : arg.moduleId,
        progress : progress
      });
    });

});
