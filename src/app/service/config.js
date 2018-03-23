"use strict";

//var remote = require('remote');
//var app = remote.require('app');
var app = require('electron').remote.app;
// see https://github.com/sindresorhus/electron-store
const Store = require('electron-store');
const path = require('path');
const fs = require('fs');

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
    "commandLibraryFilePath": path.join(app.getPath('userData'),"commands.json"),
    "puttyFilePath"         :'putty.exe',
    "winscpFilePath"        :'winscp.exe',
    "persistentDesktop"     : true,
    "desktopGroupByCategory": false,
    "expandTomcatView"      : false,
    "expandWebappView"      : false,
    // is the checkbox to save user entered password checked ?
    "checkSavePwdToSession" : true,
    "recent" : {
      // "ctdbPath" : '/path/to/latest'
    },
    "desktop" : []
  }
});

console.log("loading config from ", store.path);
console.log("version ", app.getVersion());
console.log("name ", app.getName());
console.log("appData ", app.getPath('appData'));
console.log("userData ", app.getPath('userData'));


module.exports = {
  "store" : store,
  /**
   * Returns the recent CTDB folder path as stored in the configuration file.
   * If no recent folder is found or if it is found but doesn't exist, the default
   * ctdb folder path is returned
   *
   * @return {string} absolute folder path
   */
  "getRecentCTDBPath" : function() {
    let result = ( store.has('recent.ctdbPath') ? store.get('recent.ctdbPath') : store.get('ctdbFolderPath'));
    if( fs.existsSync( result ) === false) {
      result = store.get('ctdbFolderPath');
    }
    return result;
  },
  /**
   * Add a desktop item to the persistent config. This is to allow
   * reload of the last used desktop
   * @param  {string} filepath desktop item filepath
   */
  "addDesktopItem" : function(filepath) {
    let desktop = store.get("desktop");
    // avoid add duplicate
    if( desktop.findIndex( item => item === filepath) === -1) {
      desktop.push(filepath);
      store.set("desktop",desktop);
    }
  },
  /**
   * Remove a item from the persistent config.
   * @param  {string} filepath desktop item filepath
   */
  "removeDesktopItem" : function(filepath) {
    store.set("desktop",store.get("desktop").filter( file => file !== filepath));
  },
  /**
   * Returns the list of desktop item filepath previously saved in the persistent
   * config file. This is used to reload the last used desktop.
   */
  "getDesktopItems" : function() {
    return store.get("desktop");
  },
  /**
   * Remove all doesktop item from the persistent config storage (file)
   */
  "clearDesktop" : function() {
    store.set("desktop",[]);
  }
};
