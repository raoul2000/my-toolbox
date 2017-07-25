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
  download = {};  // reset download module states
  moduleReference = {};
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

// provide the moduleRef data
ipcMain.on('nx-load-module-ref.start',function(event){
  console.log('nx-load-module-ref.start');
  init();
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

  let extractReleaseVersion = function(info) {
    if (info.data && Array.isArray(info.data)) {
      return info.data.filter(function(item) {
        return item.leaf === false && item.text.toUpperCase().endsWith('-SNAPSHOT') === false;
      }).map(function(item) {
        return item.text;
      });
    } else {
      return [];
    }
  };

  let extractSnapshotVersion = function(info) {
    if (info.data && Array.isArray(info.data)) {
      return info.data.filter(function(item) {
        return item.leaf === false  && item.text.toUpperCase().endsWith('-SNAPSHOT') === true;
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
        release: extractReleaseVersion(result.release),
        snapshot: extractSnapshotVersion(result.snapshot)
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
//  },
//  download : {
//      "resourceURI": "http://hostname:8080/nexus/service/local/repositories/releases/content/com/company/webapp/m1/2.3.19/",
//      "relativePath": "/com/company/webapp/m1/2.3.19/",
//      "text": "2.3.19",
//      "leaf": false,
//      "lastModified": "2013-10-15 10:27:00.0 UTC",
//      "sizeOnDisk": -1
//    }
// }
ipcMain.on('nx-download-mod.start', function(event, arg) {
  console.log("nx-download-mod.start");
  console.log(arg);

  let downloadUrl = arg.download.resourceURI;
  let downloadFilename = arg.download.text;

  console.log("download url", downloadUrl);

  // first check that the configured download folder exist !
  let localFolderPath = config.get('nexus.downloadFolder');
  if( ! fs.existsSync(localFolderPath)) {
    event.sender.send('nx-download-mod.error',{
      message : 'the configured download folder could not be found'
    });
    return;
  }

  // compute local filepath
  let localFilePath = path.join(localFolderPath , downloadFilename);
  console.log("localFilePath = "+localFilePath);

  // if target file already exist, delete it
  if( fs.existsSync(localFilePath)) {
    fs.unlinkSync(localFilePath);
  }

  // ok, we have th war file url to download, and the local file path for the
  // destination : let's go !

  // update the general download state object
  download[arg.moduleId] = {
    state : "start"
  };

  // this callback function is passed to the downloader and called periodically to check
  // if download can continue or if the user request its cancelation
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

  nexusDownloader.download(
    downloadUrl,
    localFilePath,
    config.get('nexus.requestTimeout'),
    downloadContinue(arg.moduleId)
  )
  .then(function(result) {
    // module have been downloaded : create its metadata file
    // with default values
    let metadataFilePath = localFilePath.concat('.meta');

    fs.writeFileSync(
      metadataFilePath,
      JSON.stringify({
        "moduleId" : arg.moduleId,
        "version"  : arg.version,
        "symlink"  : arg.moduleId,
        "installFolder" : arg.moduleId+'-'+arg.version
      },null,2) // pretty print json
    );

    download[arg.moduleId] = {state : "done" }; // update download state
    event.sender.send('nx-download-mod.done', {
      "moduleId"      : arg.moduleId,
      "url"           : downloadUrl,
      "localFilePath" : localFilePath
    });
  })
  .progress(function(progress) {
    console.log(progress);
    download[arg.moduleId] = { state : "progress" };  // update download state
    event.sender.send('nx-download-mod.progress', {
      "moduleId"      : arg.moduleId,
      "progress"      : progress,
      "url"           : downloadUrl,
      "localFilePath" : localFilePath
    });
  })
  .catch(function(error){
    console.log('nx-download-mod.error');
    console.log(error);
    event.sender.send('nx-download-mod.error', {
      "message" : error && error.message ? error.message : "failed to download module",
      "error"   : error,
      "input"   : arg
    });
  });
});

// finds what is the name of the file to download for a specific module, version
// and category.
//
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
ipcMain.on('nx-find-download.start', function(event , arg){
  console.log('nx-find-download.start');

  // intialize the version url that is used to get all files available for a given
  // module, version, and version category (e.g. m1, version 1.2 - cat : release)
  let versionListUrl = '';
  if( arg.cat === 'release') {
    versionListUrl = arg.url.release + '/' + arg.version;
  } else {
    versionListUrl = arg.url.snapshot + '/' + arg.version;
  }
  console.log("versionListUrl = "+versionListUrl);

  nexusAPI.getWarfileDescriptor(versionListUrl)
  .then(function(warfileDesc){
    console.log(warfileDesc);

    arg.warFileDescriptors = warfileDesc; // array of file descriptors
    event.sender.send('nx-find-download.done', arg);
    return true;
  })
  .catch(function(error){
    console.log('nx-find-download.error');
    console.log(error);
    event.sender.send('nx-find-download.error', {
      message :  error && error.message ? error.message : "unexpected error",
      error   : error,
      input   : arg
    });
  });

});
