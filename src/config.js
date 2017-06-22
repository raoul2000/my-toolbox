'use strict';
const electron = require('electron');
const Conf     = require('conf');



// Default Config (Read only) /////////////////////////////////////////////////
//
const defaultConfig = {
  'nexus.downloadFolder' : (electron.app || electron.remote.app).getPath('downloads'),
  'nexus.confFolder'     : (electron.app || electron.remote.app).getPath('userData'),
  'nexus.requestTimeout' : 30, // in seconds
  'ansible.remoteInstallBasePath' : '/remote/base/path'
};
const getdefaultConfig = function(key) {
  return defaultConfig[key];
};

exports.defaultConfig = {
  get : getdefaultConfig
};
let userConfigObject = {
  'nexus' : {
    "downloadFolder" : null,
    "confFolder"     : null,
    "requestTimeout" : 30  // in seconds
  },
  'ansible' : {
    'remoteInstallBasePath' : '/remote/base/path'
  }
};
// user Config (read/write) ///////////////////////////////////////////////////
const userConfig = new Conf();

exports.userConfig = userConfig;
console.log('conf file : '+userConfig.path);
// safe Config Reader //////////////////////////////////////////////////////////
//
exports.config = {
  get : function(key) {
    console.log(defaultConfig);
    return userConfig.get(key, getdefaultConfig(key));
  }
};
