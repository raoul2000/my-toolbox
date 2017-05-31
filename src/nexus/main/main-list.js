"use strict";
const electron = require('electron');
const ipcMain = electron.ipcMain;
const nexusAPI = require('../node/nexus-api');
const nexusDownloader = require('../node/nexus-downloader');
const config = require('../../config').config;
const fs = require('fs');
const path = require('path');

// store current download states per module
let download = {

};
// the module reference object (loaded on main)
let moduleReference = {};

/**
 * perform initialisation
 */
function init() {
  try {
    let modRefFilename = path.join(
      config.get('nexus.confFolder'),
      'module-ref.json'
    );
    console.log("loading module-ref from file : "+modRefFilename);
    moduleReference = JSON.parse(fs.readFileSync(modRefFilename, "utf-8" ));
  } catch (e) {
    moduleReference.error = e;
    console.error(e);
  }
}
init();

// provide the moduleRef data
ipcMain.on('nx-load-module-ref.start',function(event){
  console.log('nx-load-module-ref.start');
  if( moduleReference.error) {
    event.sender.send('nx-load-module-ref.error', moduleReference.error);
  } else {
    event.sender.send('nx-load-module-ref.done', moduleReference);
  }
});

/**
 * Load version info (release and snapshot) for a module.
 * arg = {
 *  'id' : "moduleId",
 *  url : {
 *    release : "url",
 *    snapshot : "url",
 *    changes : "url",
 *    doc : "url"
 *    }
 * }
 * @param  {event} event the event object
 * @param  {object} arg   module ref url and id
 * @return {[type]}       [description]
 */
ipcMain.on('nx-fetch-version.start', function(event, arg) {
  console.log(arg);

  let extractVersion = function(info) {
    if (info.data && Array.isArray(info.data)) {
      return info.data.filter(function(item) {
        return item.leaf === false;
      }).map(function(item) {
        return item.text;
      });
    } else {
      return [];
    }
  };

  nexusAPI.fetchModuleVersion(arg)
  .then(function(result) {
    if( result.release && result.snapshot) {
      arg.version = {
        release: extractVersion(result.release),
        snapshot: extractVersion(result.snapshot)
      };
      console.log(arg);
      event.sender.send('nx-fetch-version.done', arg);
    } else {
      event.sender.send('nx-fetch-version.error', arg);
    }
  });
});


// Request to cancel current module download
ipcMain.on('nx-download-mod.cancel', function(event, arg) {
  console.log('#### nx-download-mod.cancel');
  console.log(arg);

  download[arg.moduleId] = {
    state : "cancel",
  };
  console.log("download : ");
  console.log(download);
});

// initiate module file download
// arg = {
//  moduleId : "id",
//  version : 1.2.0, // the selected version
//  cat : "release", // version category
//  url : {
//    release : "url",
//    snapshot : "url",
//    change : "url",
//    doc : "url",
//  }
// }
ipcMain.on('nx-download-mod.start', function(event, arg) {
  console.log("nx-download-mod.start");
  console.log(arg);

  // first check that the sonfigured download folde exist !
  let localFolderPath = config.get('nexus.downloadFolder');
  if( ! fs.existsSync(localFolderPath)) {
    event.sender.send('nx-download-mod.error',{
      message : 'the configured download folder could not be found'
    });
    return;
  }

  // intialize the version url that is used to get all files available for a given
  // module, version, and version category (e.g. m1, version 1.2 - cat : release)
  let versionListUrl = '';
  if( arg.cat === 'release') {
    versionListUrl = arg.url.release + '/' + arg.version;
  } else {
    versionListUrl = arg.url.snapshot + '/' + arg.version;
  }
  console.log("versionListUrl = "+versionListUrl);

  // get the war file url for this version
  nexusAPI.getWarfileDescriptor(versionListUrl)
  .then(function(warfileDesc){
    console.log(warfileDesc);

    // compute local filepath
    let localFilePath = path.join(localFolderPath ,warfileDesc.text);
    console.log("localFilePath = "+localFilePath);

    // if target file already exist, lets delete it
    if( fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    // ok, we have th war file url to download, and the local file path for the
    // destination : let's go !

    // update the general download state object
    download[arg.moduleId] = {
      state : "start",
    };

    // this function is passed to the downloader and called periodically to check
    // if download can continue or the user request its cancelation
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

    return nexusDownloader.download(
        warfileDesc.resourceURI,
        localFilePath,
        downloadContinue(arg.moduleId)
      )
      .then(function(result) {
        download[arg.moduleId] = {state : "done" }; // update download state
        event.sender.send('nx-download-mod.done', {
          moduleId : arg.moduleId
        });
      })
      .progress(function(progress) {
        console.log(progress);
        download[arg.moduleId] = { state : "progress" };  // update download state
        event.sender.send('nx-download-mod.progress', {
          moduleId : arg.moduleId,
          progress : progress
        });
      })
      .catch(function(error){
          console.log('nx-download-mod.error');
          console.log(error);
          event.sender.send('nx-download-mod.error', {
            message : error && error.message ? error.message : "failed to download module",
            error   : error,
            input   : arg
          });
        });
  })
  .catch(function(error){
    console.log('nx-download-mod.error');
    console.log(error);
    event.sender.send('nx-download-mod.error', {
      message :  error && error.message ? error.message : "unexpected error",
      error   : error,
      input   : arg
    });
  });
  /*
    return nexusDownloader.download(
        warfileDesc.resourceURI,
        localFilePath,
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
          message : "error",
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
  })
  .catch(function(error){
    console.log('nx-download-mod.error');
    console.log(error);
    event.sender.send('nx-download-mod.error', {
      message : "error",
      error : error
    });
  });
*/

});
