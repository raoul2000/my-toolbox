"use strict";

//var remote = require('remote');
//var app = remote.require('app');
var app = require('electron').remote.app;
// see https://github.com/sindresorhus/electron-store
const Store = require('electron-store');
const path = require('path');

let defaultValue = {
  'appDataPath'    : app.getPath('userData'),
  'ctdbFolderPath' : path.join(app.getPath('userData'),'ctbd')
};

const store = new Store({
  "name" : "my-toolbox",
  "defaults" : {
    "appDataPath"           : defaultValue.appDataPath, // on windows C:\Users\Utilisateur\AppData\Roaming\<appName>
    "ctdbFolderPath"        : defaultValue.ctdbFolderPath,
    // 'deployFolderPath' : absolute path of the folder where  modules are :
    // - downloaded from maven
    // - uploaded on deployement
    "deployFolderPath"      : app.getPath('downloads'),
    "webappCatalogFilePath" : path.join(app.getPath('userData'),"web-app-catalog.json"),
    "puttyFilePath"         :'putty.exe',
    "winscpFilePath"        :'winscp.exe',
    "recent" : {
      // "ctdbPath" : '/path/to/latest'
    }
  }
});
console.log("loading config from ", store.path);
console.log("version ", app.getVersion());
console.log("name ", app.getName());
console.log("appData ", app.getPath('appData'));
console.log("userData ", app.getPath('userData'));


module.exports = {
  "store" : store,
  // TODO : add comments
  "getCTDBPath" : function() {
    console.log("getCTDBPath");
    let result = ( store.has('recent.ctdbPath') ? store.get('recent.ctdbPath') : store.get('ctdbFolderPath'));
    if( result.replace(store.get('ctdbFolderPath'),'') === result) {
      result = store.get('ctdbFolderPath');
    }
    return result;
  },
  "setRecentCTDBPath" : function(path) {

  }

};
