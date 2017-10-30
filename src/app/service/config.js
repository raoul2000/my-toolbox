"use strict";

//var remote = require('remote');
//var app = remote.require('app');
var app = require('electron').remote.app;
// see https://github.com/sindresorhus/electron-store
const Store = require('electron-store');
const path = require('path');

const store = new Store({
  "name" : "my-toolbox",
  "defaults" : {
    "appDataPath" : app.getPath('userData'), // on windows C:\Users\Utilisateur\AppData\Roaming\<appName>
    "ctdbFolderPath"    : path.join(app.getPath('userData'),'ctbd'),
    // 'deployFolderPath' : absolute path of the folder where  modules are :
    // - downloaded from maven
    // - uploaded on deployement
    "deployFolderPath" : app.getPath('downloads'),
    "webappCatalogFilePath" : path.join(app.getPath('userData'),"web-app-catalog.json")
  }
});
console.log("loading config from ", store.path);
console.log("version ", app.getVersion());
console.log("name ", app.getName());
console.log("appData ", app.getPath('appData'));
console.log("userData ", app.getPath('userData'));



//module.exports = store;
module.exports = store;
